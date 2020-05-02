declare var BOTARCAPI_MAJOR: number;
declare var BOTARCAPI_MINOR: number;
declare var BOTARCAPI_VERSION: number;
declare var BOTARCAPI_VERSTR: string;
declare var BOTARCAPI_WHITELIST: Array<RegExp>;

declare var ARCAPI_RETRY: number;
declare var ARCAPI_VERSION: number;
declare var ARCAPI_APPVERSION: string;
declare var ARCAPI_USERAGENT: string;

declare var DATABASE_PATH: string;
declare var SERVER_PORT: number;

declare var LOG_LEVEL: number;
declare var LOG_PATH: string;


declare var ARCACCOUNT: Array<IArcAccount>;
declare var ARCPERSISTENT: { [key: string]: IArcAccount };

declare var DATABASE_ARCACCOUNT: any;
declare var DATABASE_ARCBEST30: any;
declare var DATABASE_ARCSONG: any;
declare var DATABASE_ARCRECORD: any;
declare var DATABASE_ARCPLAYER: any;

declare var syslog: SystemLog;