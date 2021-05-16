declare var BOTARCAPI_MAJOR: number;
declare var BOTARCAPI_MINOR: number;
declare var BOTARCAPI_VERSION: number;
declare var BOTARCAPI_VERSTR: string;
declare var BOTARCAPI_WHITELIST: Array<RegExp>;
declare var BOTARCAPI_BATCH_ENDPOINTS_MAX: number;
declare var BOTARCAPI_FORWARD_WHITELIST: Array<RegExp>;
declare var BOTARCAPI_FORWARD_TIMESEC_MAX: number;
declare var BOTARCAPI_FORWARD_TIMESEC_DEFAULT: number;
declare var BOTARCAPI_FORWARD_FEED_MAX: number;
declare var BOTARCAPI_USERBEST_HISTORY_MAX: number;
declare var BOTARCAPI_USERBEST_HISTORY_DEFAULT: number;
declare var BOTARCAPI_AGGREGATE_LIMITATION: number;
declare var BOTARCAPI_AGGREGATE_ENABLED: boolean;
declare var BOTARCAPI_AGGREGATE_CONCURRENT: boolean;
declare var BOTARCAPI_FRONTPROXY_NODES: Array<FontProxyNode>;

interface FontProxyNode {
  url: string,
  weight: number
  enabled: boolean,
}

declare var ARCAPI_RETRY: number;
declare var ARCAPI_VERSION: number;
declare var ARCAPI_APPVERSION: string;
declare var ARCAPI_USERAGENT: string;
declare var ARCAPI_URL: string;
declare var ARCAPI_URL_CODENAME: string;

declare var DATABASE_PATH: string;
declare var SERVER_PORT: number;

declare var LOG_LEVEL: number;
declare var LOG_PATH: string;

declare var ARCACCOUNT: any;
declare var ARCPERSISTENT: {
  [key: string]: {
    account: any,
    feed: number,
    feeded: number,
    validtime: number,
    proc?: any
  }
};
declare var DATABASE_ARCACCOUNT: any;
declare var DATABASE_ARCBEST30: any;
declare var DATABASE_ARCPLAYER: any;
declare var DATABASE_ARCRECORD: any;
declare var DATABASE_ARCSONG: any;
