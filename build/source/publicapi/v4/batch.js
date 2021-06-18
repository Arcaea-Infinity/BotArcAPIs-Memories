"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TAG = 'v4/batch.ts\t';
const syslog_1 = __importDefault(require("../../modules/syslog/syslog"));
const utils_1 = __importDefault(require("../../corefunc/utils"));
const apierror_1 = __importDefault(require("../../modules/apierror/apierror"));
const safe_eval_1 = __importDefault(require("safe-eval"));
exports.default = (argument) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (typeof argument.calls == 'undefined' || argument.calls == '')
                throw new apierror_1.default(-1, 'invalid endpoints');
            let _endpoints = {};
            let _return = [];
            let _vm_vartable = {};
            let _vm_reftable = {};
            let _vm_resultbox = {};
            try {
                _endpoints = JSON.parse(argument.calls);
            }
            catch (e) {
                syslog_1.default.e(e.stack);
                throw new apierror_1.default(-2, 'invalid endpoints');
            }
            if (!(_endpoints instanceof Array))
                throw new apierror_1.default(-3, 'invalid endpoints');
            if (_endpoints.length > BOTARCAPI_BATCH_ENDPOINTS_MAX)
                throw new apierror_1.default(-4, 'too many endpoints requested');
            _endpoints.forEach((element) => {
                if (!element.bind)
                    return;
                if (!utils_1.default.checkBindStatement(element.bind))
                    throw new apierror_1.default(-5, 'invalid bind variables');
                Object.keys(element.bind).forEach(varname => {
                    if (!varname.startsWith('$'))
                        throw new apierror_1.default(-6, 'bind variables must start with character $');
                    _vm_vartable = Object.assign(Object.assign({}, _vm_vartable), element.bind);
                    _vm_reftable = Object.assign(Object.assign({}, _vm_reftable), { [varname]: `result${element.id}` });
                });
            });
            for (let i = 0; i < _endpoints.length; ++i) {
                let _endret = {};
                try {
                    _endret = yield do_single_operation(_endpoints[i], _vm_vartable, _vm_reftable, _vm_resultbox);
                }
                catch (e) {
                    if (e instanceof apierror_1.default)
                        _endret = { status: e.status, message: e.notify };
                    else {
                        _endret = { status: -233, message: 'unknown error occurred in endpoint' };
                        syslog_1.default.e(e.stack);
                    }
                }
                _return.push({
                    id: _endpoints[i].id,
                    result: _endret
                });
            }
            resolve(_return);
        }
        catch (e) {
            if (e instanceof apierror_1.default)
                return reject(e);
            syslog_1.default.e(TAG, e.stack);
            return reject(new apierror_1.default(-233, 'unknown error occurred'));
        }
    }));
};
const do_single_operation = (endpoint, vartable, reftable, resultbox) => __awaiter(void 0, void 0, void 0, function* () {
    const regexp = /=(\$\S*?)&/g;
    let donext = false;
    let result = {};
    do {
        result = regexp.exec(endpoint.endpoint + '&');
        donext = !(!result);
        if (donext) {
            if (result.length != 2)
                continue;
            const varname = result[1];
            const varexpr = vartable[varname];
            let val = {};
            try {
                val = safe_eval_1.default(varexpr, resultbox[reftable[varname]]);
            }
            catch (e) {
                throw new apierror_1.default(-1, 'run expression failed');
            }
            endpoint.endpoint = endpoint.endpoint.replace(varname, val);
        }
    } while (donext);
    const _url = new URL(`http://example.com/${endpoint.endpoint}`);
    let _path = _url.pathname;
    const _arguments = utils_1.default.httpGetAllParams(_url.searchParams);
    let _entry = {};
    let _return = {};
    if (_path == 'batch')
        throw new apierror_1.default(-2, 'batch api cannot include another batch endpoint');
    try {
        if (new RegExp(/^\/forward\/forward\//).test(_path)) {
            _path = _path.replace('/forward/forward/', '');
            _entry = yield Promise.resolve().then(() => __importStar(require(`./forward/forward`)));
        }
        else
            _entry = yield Promise.resolve().then(() => __importStar(require(`./${_path}.js`)));
        _entry = _entry.default;
    }
    catch (e) {
        throw new apierror_1.default(-3, 'endpoint not found');
    }
    yield _entry(_arguments, 'GET', _path)
        .then((result) => {
        _return.status = 0;
        _return.content = result;
        resultbox[`result${endpoint.id}`] = _return.content;
    })
        .catch((error) => {
        _return.status = error.status;
        _return.message = error.notify;
    });
    return _return;
});
//# sourceMappingURL=batch.js.map