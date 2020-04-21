// filename : corefunc/config.js
// author   : TheSnowfield
// date     : 04/09/2020
// comment  : global config

const TAG = 'corefunc/config.js';
const CONFIGS = {
  // botarcapi version
  'BOTARCAPI_MAJOR': 1,
  'BOTARCAPI_MINOR': 0,
  'BOTARCAPI_VERSION': 0,
  'BOTARCAPI_VERSTR': 'BotArcAPI v1.0.0',

  // arcaea api config
  'ARCAPI_VERSION': 11,
  'ARCAPI_APPVERSION': '2.6.1c',
  'ARCAPI_USERAGENT': 'Grievous Lady (Linux; U; Android 2.3.3; BotArcAPI)',

  // path to database folder
  'DATABASE_PATH': require.main.path + '/savedata/',

  // http server listening post
  'SERVER_PORT': 80,

  // log level
  // 3: Error, Fatal
  // 2: Warning, Error, Fatal
  // 1: Information, Warning, Error, Fatal
  // 0: Verbose, Information, Warning, Error, Fatal
  'LOG_LEVEL': 0,

  // path to log folder
  'LOG_PATH': require.main.path + '/savelogs/'
}

const loadConfigs = () => {

  // load environment from docker containers
  // and overriding default configs =(:3) z)_
  const _external_config = process.env.BOTARCAPI_CONFIG;
  try {
    const _root = JSON.parse(_external_config);
    for (v in _root)
      CONFIGS[v] = _root[v];
  } catch (e) { }

  // this is a hack to load
  // config macros into global space
  for (let [k, v] of Object.entries(CONFIGS)) {
    Object.defineProperty(global, k, { value: v, writable: false, configurable: false });
  }
  Object.freeze(CONFIGS);
}

const printConfigs = () => {
  syslog.v(TAG, 'Global Config');
  for (let [k, v] of Object.entries(CONFIGS)) {
    syslog.v(TAG, `  ${k} => ${v}`);
  }
}

module.exports.loadConfigs = loadConfigs;
module.exports.printConfigs = printConfigs;
