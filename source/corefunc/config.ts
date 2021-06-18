const TAG = 'corefunc/config.ts';

import syslog from '../modules/syslog/syslog';

const _default_config: any = {
  // botarcapi version
  'BOTARCAPI_MAJOR': 0,
  'BOTARCAPI_MINOR': 3,
  'BOTARCAPI_VERSION': 6,
  'BOTARCAPI_VERSTR': 'BotArcAPI v0.3.6',

  // useragent whitelist
  // if set '[]' will accept all requests
  // supported regex
  'BOTARCAPI_WHITELIST': [],

  // the max of endpoint limitation for batch api
  'BOTARCAPI_BATCH_ENDPOINTS_MAX': 10,

  // forwarding whitelist
  // BotArcAPI can forward apis in whitelist only
  'BOTARCAPI_FORWARD_WHITELIST': [
    /^user\/me/g,
    /^friend\/me\/add/g,
    /^friend\/me\/delete/g,
    /^score\/song/g,
    /^score\/song\/me/g,
    /^score\/song\/friend/g
  ],

  // the valid time for the token
  // BotArcAPI will recycle the token while time exceed
  'BOTARCAPI_FORWARD_TIMESEC_MAX': 120,

  // the default valid time for the token
  'BOTARCAPI_FORWARD_TIMESEC_DEFAULT': 10,

  // the number of times the callers can extend the valid time of the token
  // BotArcAPI will decline the feeds while exceeding the limitation
  'BOTARCAPI_FORWARD_FEED_MAX': 2,

  'BOTARCAPI_USERBEST_HISTORY_MAX': 20,
  'BOTARCAPI_USERBEST_HISTORY_DEFAULT': 7,

  // aggregate limit
  'BOTARCAPI_AGGREGATE_LIMITATION': 6,

  // sending only one 'compose/aggregate' request instead
  // of send a huge of requests to arcapi.
  // this feature is for 3.6.0 arcapi
  'BOTARCAPI_AGGREGATE_ENABLED': false,

  // sending requests concurrently
  // only valid on 'BOTARCAPI_AGGREGATE_ENABLED' set to false
  'BOTARCAPI_AGGREGATE_CONCURRENT': false,

  // frontend http proxy
  // used to load balance for per ip
  // change this will ignore the 'ARCAPI_URL' config
  // if set to '[]' will disable the frontend proxy
  'BOTARCAPI_FRONTPROXY_NODES': [
    /*   1 ms */ { enabled: true, weight: 1.0, url: "http://arc.p.xecus.cc" },
    /*  53 ms */ { enabled: true, weight: 1.0, url: "https://arcapi.xuekirby.top" },
    /*  90 ms */ { enabled: true, weight: 0.8, url: "http://source-api.lxns.org/botarcapi_proxy" },
  ],

  // change proxy node when request fail
  // this feature is for 3.6.0 arcapi
  'BOTARCAPI_FRONTPROXY_CHANGE_NODE': false,

  // arcaea api config
  'ARCAPI_RETRY': 3,
  'ARCAPI_VERSION': 14,
  'ARCAPI_APPVERSION': '3.6.2c',
  'ARCAPI_USERAGENT': 'Grievous Lady (Linux; U; Android 2.3.3; BotArcAPI)',
  'ARCAPI_URL': 'https://arcapi.lowiro.com',
  'ARCAPI_URL_CODENAME': 'blockchain',

  // path to database folder
  'DATABASE_PATH': './savedata/',

  // http server listening post
  'SERVER_PORT': 8080,

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
