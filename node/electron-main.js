//
// Run p5videoKet as electron process to allow for restart and other options

import { app, BrowserWindow, screen, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Needed for __dirname with ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('__dirname', __dirname);
// console.log('process.env.HOME', process.env.HOME);

import { parse_argv } from './lib/parse_argv.js';
import { setup_download } from './lib/setup_download.js';
import { setup_restart, parse_period } from './lib/setup_restart.js';

// Disabled 2026-03
// import { mbase_init, mbase_update_line } from './lib/mbase.js';

let my = {};

globalThis.my = my;

my.app = app;
my.root_index_path = '../src/index.html';
my.download_path = path.resolve(process.env.HOME, 'Downloads');
my.download_limit = -1;
my.opt = { h: 1 };
my.playlist = null; // array of urls
my.playlist_times = []; // array of "hh:mm:ss" periods, cycled per url
my.playlist_index = 0;
my.playlist_timer = null;
my.playlist_end_time = 0; // epoch ms when current playlist item advances (0 = none)
my.speed = 1; // --speed n divides all time periods by n
// my.width_trim;
// my.mainWindow;

console.log('download_path', my.download_path);
// console.log('globalThis', globalThis);
// console.log('window', window);

parse_argv(my, process.argv);

console.log('opt', my.opt);

app.whenReady().then(() => {
  const screens = screen.getAllDisplays();
  let index = my.opt.index || '1';
  index = parseFloat(index) - 1;
  if (index < 0) index = 0;
  if (index >= screens.length) index = screens.length - 1;
  const primaryDisplay = screens[index];
  let { x, y, width, height } = primaryDisplay.workArea;

  // Create a window that fills the sceen's available work area.
  // const primaryDisplay = screen.getPrimaryDisplay();

  // Adjust width and position for debugging
  if (my.width_trim) {
    console.log('width_trim', my.width_trim, 'width', width);
    let nwidth = Math.floor(width * my.width_trim);
    // Make window flush right
    x += width - nwidth;
    width = nwidth;
    console.log('width_trim x', x, 'width', width);
  } else if (my.portrait) {
    let nwidth = 1080 * my.portrait;
    height = 1920 * my.portrait;
    // Make window flush right
    x += width - nwidth;
    width = nwidth;
    console.log('x', x, 'width', width, 'height', height);
  }
  // console.log('my.zoom_level', my.zoom_level);
  let webPreferences = {
    nodeIntegration: true,
    // preload: path.join(__dirname, './cjs/preload-scroll.cjs'),
    // zoomLevel: my.zoom_factor, // 1.8,
  };
  if (my.mo_app) {
    webPreferences.preload = path.join(__dirname, './cjs/preload-scroll.cjs');
  }
  if (my.preload_arg != undefined) {
    webPreferences.preload = my.preload_arg;
    console.log('my.preload_arg |' + my.preload_arg + '|');
  }

  my.mainWindow = new BrowserWindow({
    x,
    y,
    width,
    height,
    webPreferences,
  });

  if (my.opt.debug) {
    my.mainWindow.webContents.openDevTools();
  }

  // opt.u = opt.u || '';
  // opt.s = opt.s || '';
  // opt.d = opt.d || '';
  // opt.h = opt.h || '';
  // const url_options = { query: { u: opt.u, s: opt.s, d: opt.d, h: opt.h } };
  load_root_index(my);

  // mainWindow.fullScreen = opt.fullScreen;
  setTimeout(function () {
    my.mainWindow.fullScreen = my.opt.fullScreen;
  }, 5 * 1000);

  setup_download(my);

  setup_countdown_overlay(my);

  if (my.playlist_times.length > 0) {
    // playlist "times" drive the timer; restart_period is not used
    if (my.opt.restart_period) {
      console.log('playlist times override restart_period', my.opt.restart_period);
    }
  } else {
    // Legacy: restart_period advances the playlist (or reloads root)
    setup_restart(my, my.playlist ? playlist_advance : load_root_index);
  }

  setup_mo_app(my);

  setup_playlist_ipc(my);
  //
});

function timeNow() {
  const now = new Date();
  return now.toISOString() + ' ' + now.toDateString() + ' ' + now.toLocaleTimeString();
  // return now.toDateString() + ' ' + now.toLocaleTimeString();
}

// "HH:MM:SS", "MM:SS" or "SS"
function is_time_period(str) {
  return /^\d+(:\d+){0,2}$/.test(str.trim());
}

// Load playlist JSON. Accepts
//   [ "https://...", "7:00", "https://...", "0:20", ... ] (url followed by time)
// or legacy
//   [ { "url": "https://...", "time": "7:00" }, ... ]   (time per url)
//   { "times": ["0:10", "05:00"], "urls": [ ... ] }      (times cycled)
//   [ "https://...", ... ]                               (plain urls)
function load_playlist(my) {
  if (!my.playlist_path || my.playlist) return;
  try {
    const playpath = path.join(__dirname, my.playlist_path);
    const data = JSON.parse(fs.readFileSync(playpath, 'utf8'));
    if (Array.isArray(data)) {
      // Items may be url strings (optionally followed by a time string)
      // or { url, time } objects
      my.playlist = [];
      my.playlist_times = [];
      for (const item of data) {
        if (typeof item === 'string') {
          if (is_time_period(item)) {
            if (my.playlist.length > 0) {
              my.playlist_times[my.playlist.length - 1] = item.trim();
            } else {
              console.warn('Playlist time', item, 'has no preceding url, ignored');
            }
          } else {
            my.playlist.push(item);
            my.playlist_times.push('');
          }
        } else if (item && item.url) {
          my.playlist.push(item.url);
          my.playlist_times.push(item.time || '');
        }
      }
      // No times at all: leave empty so restart_period / manual control applies
      if (!my.playlist_times.some((t) => t)) my.playlist_times = [];
    } else {
      my.playlist = data.urls || [];
      my.playlist_times = data.times || [];
    }
    my.playlist_index = 0;
    console.log('Loaded playlist with', my.playlist.length, 'URLs', 'times', my.playlist_times, timeNow());
  } catch (err) {
    console.error('Failed to load playlist:', err.message);
  }
}

// Load the current url (playlist item or root) and schedule the next advance
function load_root_index(my) {
  load_playlist(my);

  // Determine URL to load
  let url_to_load = my.root_index_path;
  if (my.playlist && my.playlist.length > 0) {
    url_to_load = my.playlist[my.playlist_index];
    console.log('Loading playlist item', my.playlist_index + 1, 'of', my.playlist.length, ':', url_to_load, timeNow());
  }

  const url_options = { query: my.opt };
  if (url_to_load.startsWith('http')) {
    my.mainWindow.loadURL(url_to_load);
  } else {
    my.mainWindow.loadFile(url_to_load, url_options);
  }

  schedule_playlist_timer(my);
}

// Period for current playlist item: times[index % times.length] / speed
function schedule_playlist_timer(my) {
  clearTimeout(my.playlist_timer);
  my.playlist_timer = null;
  my.playlist_end_time = 0;
  const times = my.playlist_times;
  if (!my.playlist || my.playlist.length === 0 || !times || times.length === 0) return;
  const period = times[my.playlist_index % times.length];
  const secs = parse_period(period) / my.speed;
  console.log('playlist timer', period, 'speed', my.speed, 'secs', secs);
  if (!(secs > 0)) return;
  my.playlist_end_time = Date.now() + secs * 1000;
  my.playlist_timer = setTimeout(() => playlist_advance(my), secs * 1000);
}

// Overlay a count down timer at bottom middle of the page.
// Shows 0.1s resolution when under 60 seconds, else 0.1m (fraction of minutes).
// Injected after every page load; the page ticks it locally against end time.
function setup_countdown_overlay(my) {
  my.mainWindow.webContents.on('did-finish-load', () => {
    inject_countdown(my);
  });
}

function inject_countdown(my) {
  const end = my.playlist_end_time || 0;
  const js = `(function (end) {
  clearInterval(window.__mo_countdown_iv);
  let el = document.getElementById('__mo_countdown');
  if (!end) { if (el) el.remove(); return; }
  if (!el) {
    el = document.createElement('div');
    el.id = '__mo_countdown';
    el.style.cssText = [
      'position:fixed', 'left:50%', 'bottom:0px', 'transform:translateX(-50%)',
      'z-index:2147483647', 'pointer-events:none',
      'padding:4px 0px', 'border-radius:4px',
      'background:rgba(0,0,0,0.55)', 'color:#fff',
      'font:10px/1.2 ui-monospace,Menlo,monospace',
    ].join(';');
    (document.body || document.documentElement).appendChild(el);
  }
  function tick() {
    let r = Math.max(0, (end - Date.now()) / 1000);
    el.textContent = r < 60 ? r.toFixed(1) + 's' : (r / 60).toFixed(2) + 'm';
    if (r <= 0) clearInterval(window.__mo_countdown_iv);
  }
  tick();
  window.__mo_countdown_iv = setInterval(tick, 100);
})(${end});`;
  my.mainWindow.webContents.executeJavaScript(js).catch((err) => {
    console.error('countdown inject failed:', err.message);
  });
}

function playlist_advance(my) {
  load_playlist_next(my);
}

function load_playlist_next(my) {
  if (!my.playlist || my.playlist.length === 0) return;
  my.playlist_index = (my.playlist_index + 1) % my.playlist.length;
  load_root_index(my);
}

function load_playlist_prev(my) {
  if (!my.playlist || my.playlist.length === 0) return;
  my.playlist_index = (my.playlist_index - 1 + my.playlist.length) % my.playlist.length;
  load_root_index(my);
}

function load_playlist_index(my, index) {
  if (!my.playlist || my.playlist.length === 0) return;
  if (index >= 0 && index < my.playlist.length) {
    my.playlist_index = index;
    load_root_index(my);
  }
}

function setup_mo_app(my) {
  if (my.mo_app) {
    ipcMain.on('set-line-info', (event, line) => {
      //
      console.log('set-line-info line', line);
      mbase_update_line(line);
    });
    my.dbase_status_reporter = (props) => {
      // console.log('my.dbase_status_reporter msg', props);
      my.mainWindow.webContents.send('dbase-status', props);
      // my.mainWindow.webContents.send('dbase-status', 'hello');
      // console.log('my.dbase_status_reporter AFTER');
    };
    my.rewind_action = () => {
      my.mainWindow.webContents.send('rewind', 1);
    };
    my.full_read_action = () => {
      my.mainWindow.webContents.send('full-read', 1);
    };
    my.next_action = () => {
      my.mainWindow.webContents.send('next', 1);
    };
    my.previous_action = () => {
      my.mainWindow.webContents.send('previous', 1);
    };
    my.continue_action = () => {
      my.mainWindow.webContents.send('continue', 1);
    };
  }
  console.log('my.mo_app', my.mo_app, 'my.mo_room', my.mo_room, 'my.mo_group', my.mo_group);
  if (my.mo_group) {
    mbase_init();
    my.mainWindow.webContents.send('init-my', { mo_group: my.mo_group });
  }
}

function setup_playlist_ipc(my) {
  ipcMain.on('playlist-next', () => {
    load_playlist_next(my);
  });
  ipcMain.on('playlist-prev', () => {
    load_playlist_prev(my);
  });
  ipcMain.on('playlist-goto', (event, index) => {
    load_playlist_index(my, index);
  });
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// Retrieve information about screen size, displays, cursor position, etc.
// For more info, see:
// https://electronjs.org/docs/api/screen

// https://www.electronjs.org/docs/latest/tutorial/ipc

// dbase_update_item({ num, text });
