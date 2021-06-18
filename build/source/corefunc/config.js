"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TAG = 'corefunc/config.ts';
const syslog_1 = __importDefault(require("../modules/syslog/syslog"));
const _default_config = {
    'BOTARCAPI_MAJOR': 0,
    'BOTARCAPI_MINOR': 3,
    'BOTARCAPI_VERSION': 6,
    'BOTARCAPI_VERSTR': 'BotArcAPI v0.3.6',
    'BOTARCAPI_WHITELIST': [],
    'BOTARCAPI_BATCH_ENDPOINTS_MAX': 10,
    'BOTARCAPI_FORWARD_WHITELIST': [
        /^user\/me/g,
        /^friend\/me\/add/g,
        /^friend\/me\/delete/g,
        /^score\/song/g,
        /^score\/song\/me/g,
        /^score\/song\/friend/g
    ],
    'BOTARCAPI_FORWARD_TIMESEC_MAX': 120,
    'BOTARCAPI_FORWARD_TIMESEC_DEFAULT': 10,
    'BOTARCAPI_FORWARD_FEED_MAX': 2,
    'BOTARCAPI_USERBEST_HISTORY_MAX': 20,
    'BOTARCAPI_USERBEST_HISTORY_DEFAULT': 7,
    'BOTARCAPI_AGGREGATE_LIMITATION': 6,
    'BOTARCAPI_AGGREGATE_ENABLED': false,
    'BOTARCAPI_AGGREGATE_CONCURRENT': false,
    'BOTARCAPI_FRONTPROXY_NODES': [
        { enabled: true, weight: 1.0, url: "http://arc.p.xecus.cc" },
        { enabled: true, weight: 1.0, url: "https://arcapi.xuekirby.top" },
        { enabled: true, weight: 0.8, url: "http://source-api.lxns.org/botarcapi_proxy" },
    ],
    'BOTARCAPI_FRONTPROXY_CHANGE_NODE': false,
    'ARCAPI_RETRY': 3,
    'ARCAPI_VERSION': 14,
    'ARCAPI_APPVERSION': '3.6.2c',
    'ARCAPI_USERAGENT': 'Grievous Lady (Linux; U; Android 2.3.3; BotArcAPI)',
    'ARCAPI_URL': 'https://arcapi.lowiro.com',
    'ARCAPI_URL_CODENAME': 'blockchain',
    'DATABASE_PATH': './savedata/',
    'SERVER_PORT': 8080,
    'LOG_LEVEL': 0,
    'LOG_PATH': './savelogs/'
};
const loadConfigs = () => {
    const _external_config = process.env.BOTARCAPI_CONFIG;
    if (_external_config) {
        try {
            const _root = JSON.parse(_external_config);
            for (const v in _root)
                _default_config[v] = _root[v];
        }
        catch (e) { }
    }
    for (const [k, v] of Object.entries(_default_config)) {
        Object.defineProperty(global, k, { value: v, writable: false, configurable: false });
    }
};
const printConfigs = () => {
    syslog_1.default.v(TAG, 'Global Config');
    for (let [k, v] of Object.entries(_default_config)) {
        syslog_1.default.v(TAG, `  ${k} => ${v}`);
    }
};
exports.default = { loadConfigs, printConfigs };
//# sourceMappingURL=config.js.map