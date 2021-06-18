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
const TAG = 'arcapi.aggregate.ts';
const syslog_1 = __importDefault(require("../syslog/syslog"));
const arcfetch_1 = __importStar(require("./arcfetch"));
const arcapi_any_1 = __importDefault(require("./arcapi.any"));
exports.default = (account, endpoints) => __awaiter(void 0, void 0, void 0, function* () {
    if (endpoints.length > BOTARCAPI_AGGREGATE_LIMITATION)
        throw new Error('Endpoints limit exceeded');
    if (BOTARCAPI_AGGREGATE_ENABLED) {
        const _endpoints = [];
        endpoints.forEach((element, index) => {
            _endpoints.push({ endpoint: element, id: index });
        });
        const _remote_request = new arcfetch_1.ArcFetchRequest(arcfetch_1.ArcFetchMethod.GET, 'compose/aggregate', {
            deviceId: account.device,
            userToken: account.token,
            submitData: new URLSearchParams({ 'calls': JSON.stringify(_endpoints) })
        });
        return arcfetch_1.default(_remote_request)
            .then((root) => {
            const _data = [];
            root.value.forEach((element) => {
                _data[element.id] = element.value[0];
            });
            return _data;
        })
            .catch((e) => {
            if (e == 'UnauthorizedError') {
                account.token = '';
                syslog_1.default.w(TAG, `Invalid token => ${account.name} ${account.token}`);
            }
            throw e;
        });
    }
    else {
        if (BOTARCAPI_AGGREGATE_CONCURRENT) {
            const _tasks = [];
            endpoints.forEach((element, index) => {
                _tasks.push(arcapi_any_1.default(account, arcfetch_1.ArcFetchMethod.GET, element, ""));
            });
            return Promise.all(_tasks)
                .then(data => {
                let _results = [];
                data.forEach((element, index) => _results.push(element.value[0]));
                return _results;
            }).catch((e) => {
                if (e == 'UnauthorizedError') {
                    account.token = '';
                    syslog_1.default.w(TAG, `Invalid token => ${account.name} ${account.token}`);
                }
                throw e;
            });
        }
        else {
            let _results = [];
            try {
                for (let i = 0; i < endpoints.length; ++i) {
                    const _data = yield arcapi_any_1.default(account, arcfetch_1.ArcFetchMethod.GET, endpoints[i], "");
                    _results.push(_data.value[0]);
                }
                return _results;
            }
            catch (e) {
                if (e == 'UnauthorizedError') {
                    account.token = '';
                    syslog_1.default.w(TAG, `Invalid token => ${account.name} ${account.token}`);
                }
                throw e;
            }
        }
    }
});
//# sourceMappingURL=arcapi.aggregate.js.map