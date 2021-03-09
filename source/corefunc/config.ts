const TAG = 'corefunc/config.ts';

import syslog from '../modules/syslog/syslog';

const _default_config: any = {
  // botarcapi version
  'BOTARCAPI_MAJOR': 0,
  'BOTARCAPI_MINOR': 2,
  'BOTARCAPI_VERSION': 5,
  'BOTARCAPI_VERSTR': 'BotArcAPI v0.2.5',

  // useragent white list
  // if set '[]' will accept all requests
  // supported regex
  'BOTARCAPI_WHITELIST': [],

  // arcaea api config
  'ARCAPI_RETRY': 3,
  'ARCAPI_VERSION': 13,
  'ARCAPI_APPVERSION': '3.5.2c',
  'ARCAPI_USERAGENT': 'Grievous Lady (Linux; U; Android 2.3.3; BotArcAPI)',

  // path to database folder
  'DATABASE_PATH': './savedata/',

  // http server listening post
  'SERVER_PORT': 80,

  // log level
  // 3: Error, Fatal
  // 2: Warning, Error, Fatal
  // 1: Information, Warning, Error, Fatal
  // 0: Verbose, Information, Warning, Error, Fatal
  'LOG_LEVEL': 0,

  // path to log folder
  'LOG_PATH': './savelogs/'
}

/**
 * load config to global space
 */
const loadConfigs = (): void => {

  // load environment from docker containers
  // and overriding default configs =(:3) z)_
  const _external_config: string | undefined = process.env.BOTARCAPI_CONFIG;
  if (_external_config) {

    try {

      const _root = JSON.parse(_external_config);
      for (const v in _root)
        _default_config[v] = _root[v];

    } catch (e) {/* do nothing */ }

  }

  for (const [k, v] of Object.entries(_default_config)) {
    Object.defineProperty(global, k, { value: v, writable: false, configurable: false });
  }

}

const printConfigs = (): void => {

  syslog.v(TAG, 'Global Config');

  for (let [k, v] of Object.entries(_default_config)) {
    syslog.v(TAG, `  ${k} => ${v}`);
  }
}

export default { loadConfigs, printConfigs };
