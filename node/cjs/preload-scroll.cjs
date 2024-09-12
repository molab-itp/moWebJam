//
const { webFrame } = require('electron');
require('./setup_responder.cjs');
require('./overlayElement.cjs');
require('./dbase_report_status.cjs');

let my = {};
window.my = my;

my.qrCodeWidth = 0.25;

my.shortStopLineNum = 5;

// my.scrollYTopShort = 670;
// my.scrollYTopShort = 760;
// my.scrollYTopShort = 580;
my.scrollYTopShort = 610;

// my.scrollYTopLong = 616;
my.scrollYTopLong = 460;

// my.scrollPeriod = 0.1; // * 0.75;
// my.elineDelayPeriod = 30; // * 0.75;

// my.scrollPeriod = 0.1 * 0.75;
// my.elineDelayPeriod = 30 * 0.75;

my.scrollPeriod = 0.1;
my.elineDelayPeriod = 30 * 0.5;

my.zoomFactorShort = 1.4;
my.zoomFactorLong = 2.18;

my.gcCount = 0;
my.margin = 32;
my.overlayColors = ['rgba(255, 80, 80, 1.0)', 'rgba(255, 180, 60, 1.0)', 'rgba(60, 190, 70, 1.0)'];
my.overlayColorsIndex = 0;

window.addEventListener('DOMContentLoaded', () => {
  setTimeout(setup_scroll, 1000);
  setup_responder();

  webFrame.setZoomFactor(my.zoomFactorShort);
  // webFrame.setZoomFactor(my.zoomFactorLong);

  let zoomFactor = webFrame.getZoomFactor();
  console.log('zoomFactor', zoomFactor);

  dbase_report_status({ msg: 'Here!' });
});

window.addEventListener('mouseup', function (event) {
  // console.log('mouseup clientX', event.clientX, 'clientY', event.clientY);
  let zoomFactor = webFrame.getZoomFactor();
  console.log('mouseup window.scrollY', window.scrollY, 'my.scrollEnabled', my.scrollEnabled);
  console.log('zoomFactor', zoomFactor);
  my.scrollEnabled = !my.scrollEnabled;
});

// window.addEventListener('resize', window_resize_handler);
// function window_resize_handler() {
//   console.log('window_resize_handler');
//   position_qrcode();
// }

function setup_scroll() {
  //
  console.log('setup_scroll my', my);
  console.log('setup_scroll window.location.href', window.location.href);

  let fi = document.querySelector('.field--field_image');
  my.authorImageDiv = fi;

  let nt = document.querySelector('.navbar-toggler');
  nt.remove();

  let pa = document.querySelector('.poem-actions--vertical');
  pa.remove();

  let et = document.querySelector('.field--title');
  let nb = document.querySelector('.navbar-brand');
  nb.innerHTML = nb.textContent + '<br/>' + et.textContent;
  nb.style.fontSize = 'xx-large';
  my.topBox = nb;

  let ar = document.querySelector('article');
  let fb = ar.querySelector('.field--body');
  my.fieldBody = fb.querySelector('p');

  my.elines = ar.querySelectorAll('.long-line');

  my.elineIndex = 0;
  my.elineDelayCount = 0;

  let period = my.scrollPeriod * 1000;
  setInterval(scroll_track, period);

  window.scrollTo(0, my.scrollYTopShort);

  start_scroll_pause();

  send_current_line();
}

function scroll_track() {
  //
  my.lastScrollY = window.scrollY;

  check_scroll_pause();

  check_line_hilite();

  if (!my.scrollEnabled) return;
  window.scrollBy(0, 1);

  // the author image moving off top of screen triggers play from top
  // in short read, when view is two column,
  // For Langstons' "America..." this is line 8 of poem
  // in full read the image is below the last line of poem

  let stopped = !my.full_read_enabled && my.elineIndex == my.shortStopLineNum - 1;

  let rt = my.authorImageDiv.getBoundingClientRect();
  if (rt.y < 0 || stopped) {
    // play_from_top();
    pause_at_bottom();
  }
}

// pause at bottom of screen before playing from top
//
function pause_at_bottom() {
  // console.log('pause_at_bottom', my.paused_at_bottom);
  if (my.paused_at_bottom) {
    check_scroll_pause();
    if (my.scrollEnabled) {
      play_from_top_short();
      my.paused_at_bottom = 0;
    }
    return;
  }
  my.paused_at_bottom = 1;
  start_scroll_pause();
}

function check_line_hilite() {
  // Keep up last hilite until starting from the top
  if (my.last_elineIndex == my.elines.length - 1) {
    let rt = my.elines[0].getBoundingClientRect();
    if (rt.y < 0) {
      my.elineIndex = my.last_elineIndex;
    }
  }

  let el = my.elines[my.elineIndex];
  let rt = el.getBoundingClientRect();
  overlayElement(el);

  // when on last line, keep client updated
  if (my.elineIndex == my.last_elineIndex) {
    send_current_line();
  }

  my.elineDelayCount = (my.elineDelayCount + 1) % my.elineDelayPeriod;
  if (my.elineDelayCount != 1) return;

  // delay new hilite until line is in upper half of window
  let midWindow = window.innerHeight / 2;
  if (rt.y > midWindow) {
    // console.log('delayed my.elineIndex', my.elineIndex);
    my.elineDelayCount = 0;
    return;
  }

  // if line is off top screen
  // search now for line that's on at mid window point
  if (rt.y < 0) {
    // Hilite scroll off top of screen
    let lastLine = my.elineIndex;
    my.offscreen = 1;
    let n = my.elines.length;
    while (rt.y < midWindow) {
      my.elineIndex = (my.elineIndex + 1) % my.elines.length;
      el = my.elines[my.elineIndex];
      rt = el.getBoundingClientRect();
      if (lastLine > my.elineIndex) break;
      n--;
      if (n < 0) break;
    }
  } else {
    my.offscreen = 0;
  }

  if (!my.scrollEnabled) return;

  // Advance to the next line
  my.last_elineIndex = my.elineIndex;
  my.elineIndex = (my.elineIndex + 1) % my.elines.length;
  my.overlayColorsIndex = (my.overlayColorsIndex + 1) % my.overlayColors.length;

  if (my.elineIndex) {
    send_current_line();
  }
}

function check_scroll_pause() {
  if (!my.scrollPauseStart) return;
  //
  let now = Date.now();
  let nowDiff = now - my.scrollPauseStart;
  if (nowDiff > my.scrollPausePeriod) {
    my.scrollEnabled = 1;
    my.scrollPauseStart = 0;
  }
}

// my.overlayColors = ['rgba(255, 205, 50, 1.0)', 'red', 'green'];
// my.overlayColors = ['rgba(255, 205, 50, 1.0)', 'rgba(255, 0, 0, 0.5)', 'rgba(0, 255, 0, 0.5)'];
// Apple Finder window close-hide-max
// let my.scrollYTop = 465;
// let my.scrollYTop = 635;
// window.innerWidth 520
// my.lastScrollY;
