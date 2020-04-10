// filename : config.js
// author   : CirnoBakaBOT
// date     : 04/09/2020
// comment  : global config

module.exports.loadMacros = () => {
  const MACROS = {
    'BOTARCAPI_MAJOR': 1,
    'BOTARCAPI_MINOR': 0,
    'BOTARCAPI_VERSION': 0,
    'BOTARCAPI_VERSTR': 'v1.0.0',

    'ARCAPI_VERSION': 10,
    'ARCAPI_APPVERSION': '2.6.2c',
    'ARCAPI_USERAGENT': 'WeLoveArcaea (Linux; U; Android 2.3.3; BotArcAPI)',

    'DATABASE_PATH': '../../savedata/',
    'SERVER_PORT': 8000
  }
  // map macros to global space
  for (let [k, v] of Object.entries(MACROS)) {
    Object.defineProperty(global, k, { value: v, writable: false, configurable: false });
  }
}
