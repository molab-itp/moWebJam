//
const { ipcRenderer, webFrame } = require('electron');

// ipcRenderer.send('asynchronous-message', 'ping')
// set-line-info
/*
ipcMain.on('set-line-info', (event, lineInfo) => {
  // dbase_update_item({ num, text });
  dbase_update_item(lineInfo);
*/

function setup_responder() {
  ipcRenderer.on('rewind', (_event, value) => {
    console.log('ipcRenderer.on rewind', value);
    play_from_top_short();
  });
  ipcRenderer.on('full-read', (_event, value) => {
    console.log('ipcRenderer.on full-read', value);
    play_from_top_long();
  });
  ipcRenderer.on('dbase-status', (_event, msg) => {
    // ipcRenderer.on('dbase_status_report', (_event, value) => {
    // console.log('ipcRenderer.on dbase_status_report msg', msg);
    dbase_report_status({ msg });
  });
}
// exports.modules.setup_responder = setup_responder;
globalThis.setup_responder = setup_responder;

function start_scroll_pause() {
  my.scrollEnabled = 0;
  my.scrollPausePeriod = 5000;
  my.scrollPauseStart = Date.now();
}
// exports.modules.start_scroll_pause = start_scroll_pause;
globalThis.start_scroll_pause = start_scroll_pause;

function send_current_line() {
  if (!my.elines) return;
  let eln = my.elines[my.elineIndex];
  let num = my.elineIndex + 1;
  let text = eln.textContent;
  let color = my.overlayColors[my.overlayColorsIndex];
  if (!my.offscreen) {
    send_lineInfo({ num, text, color });
  }
}
// exports.modules.send_current_line = send_current_line;
globalThis.send_current_line = send_current_line;

// lineInfo = { num, text }
function send_lineInfo(lineInfo) {
  ipcRenderer.send('set-line-info', lineInfo);
}

function play_from_top_short() {
  if (my.full_read_enabled) {
    webFrame.setZoomFactor(my.zoomFactorShort);
  }
  play_from_top(my.scrollYTopShort);
  my.full_read_enabled = 0;
}
// exports.modules.play_from_top_short = play_from_top_short;
globalThis.play_from_top_short = play_from_top_short;

function play_from_top_long() {
  if (!my.full_read_enabled) {
    webFrame.setZoomFactor(my.zoomFactorLong);
  }
  play_from_top(my.scrollYTopLong);
  my.full_read_enabled = 1;
}

function play_from_top(ytop) {
  //
  gc();
  my.gcCount++;
  console.log('my.gcCount', my.gcCount);

  window.scrollTo(0, ytop);

  start_scroll_pause();

  my.elineIndex = 0;
  my.elineDelayCount = 0;
  my.overlayColorsIndex = (my.overlayColorsIndex + 1) % my.overlayColors.length;

  send_current_line();
}
