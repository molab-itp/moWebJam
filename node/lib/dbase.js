//

import 'itp-molib';
// import './lib/dbase/a_dbase.js';

// !!@ electron loader does not accept moLib which is copy from repo
// !!@ best make moLib a npm package
// !!@ Need to convert to import without http
/*
import {
  initializeApp, //
} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js';
*/

// console.log('globalThis', globalThis);

export function dbase_init(my) {
  my.fireb_config = 'jht9629';
  // my.fireb_config = 'jht1493';
  // my.fireb_config = 'jhtitp';

  // my.mo_app = 'mo-america-be';
  // my.mo_room = 'm1-america';

  my.dbase_rootPath = 'm0-@r-@w-';
  my.mo_app = my.mo_app || 'mo-america-be';
  my.mo_room = my.mo_room || 'm1-america';
  my.mo_group = my.mo_group || 's0';

  // set group for all devices to share item values

  // -election excludes this device from status count report
  my.nameDevice = 'america-electron';

  if (my.mo_group == 's0') {
    my.mo_room = 'm0-america';
  }

  console.log('my.mo_app', my.mo_app, 'my.mo_room', my.mo_room, 'my.mo_group', my.mo_group);

  setup_dbase();
}

async function setup_dbase() {
  await dbase_app_init();

  console.log('setup_dbase dbase_app_init ');
  // console.log('app_init_completed my', my);
  //
  dbase_app_observe({ observed_item });

  console.log('setup_dbase dbase_app_observe');

  function observed_item(item) {
    //
    console.log('setup_dbase observed_item', item);

    dbase_if_action({ item, prop: 'action_rewind', actionFunc: my.rewind_action });
    dbase_if_action({ item, prop: 'action_full_read', actionFunc: my.full_read_action });
    dbase_if_action({ item, prop: 'action_next', actionFunc: my.next_action });
    dbase_if_action({ item, prop: 'action_previous', actionFunc: my.previous_action });
    dbase_if_action({ item, prop: 'action_continue', actionFunc: my.continue_action });
  }
}

function ui_log(...args) {
  console.log(...args);
}
globalThis.ui_log = ui_log;

function ui_error(...args) {
  ui_log(...args);
  // !!@ not available in nodejs
  // alert(...args);
}
globalThis.ui_error = ui_error;
