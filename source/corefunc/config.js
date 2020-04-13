// filename : corefunc/config.js
// author   : CirnoBakaBOT
// date     : 04/09/2020
// comment  : global config

const TAG = 'corefunc/config.js';
const MACROS = {
  // botarcapi version
  'BOTARCAPI_MAJOR': 1,
  'BOTARCAPI_MINOR': 0,
  'BOTARCAPI_VERSION': 0,
  'BOTARCAPI_VERSTR': 'v1.0.0',

  // arcaea api config
  'ARCAPI_VERSION': 11,
  'ARCAPI_APPVERSION': '2.6.1c',
  'ARCAPI_USERAGENT': 'WeLoveArcaea (Linux; U; Android 2.3.3; BotArcAPI)',

  // path to database folder
  'DATABASE_PATH': require.main.path + '/savedata/',

  // http server listening post
  'SERVER_PORT': 8000,

  // log level
  // 3: Error, Fatal
  // 2: Warning, Error, Fatal
  // 1: Information, Warning, Error, Fatal
  // 0: Verbose, Information, Warning, Error, Fatal
  'LOG_LEVEL': 0,

  // path to log folder
  'LOG_PATH': require.main.path + '/savelogs/'
}

// < TODO >
// try to load user config from external path
// ** for docker image **
// not implemented yet =(:3) z)_

// this is a hack to load
// config macros into global space

module.exports = {
  loadMacros: () => {
    for (let [k, v] of Object.entries(MACROS)) {
      Object.defineProperty(global, k, { value: v, writable: false, configurable: false });
    }
  },

  printMacros: () => {
    syslog.v(TAG, 'Global Config');
    for (let [k, v] of Object.entries(MACROS)) {
      syslog.v(TAG, `  ${k} => ${v}`);
    }
  }
}
