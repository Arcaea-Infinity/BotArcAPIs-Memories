"use strict";
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
const TAG = 'v2/arc/alloc.js\t';
const syslog_1 = __importDefault(require("../../../modules/syslog/syslog"));
const apierror_1 = __importDefault(require("../../../modules/apierror/apierror"));
const alloc_managed_1 = __importDefault(require("../../../modules/account/alloc.managed"));
exports.default = (argument) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            argument.time = parseInt(argument.time);
            argument.clear = argument.clear == 'true' ? true : false;
            if (isNaN(argument.time) || argument.time == 0)
                argument.time = 30;
            if (argument.time < 30 || argument.time > 240)
                throw new apierror_1.default(-1, 'invalid time');
            let _token = null;
            try {
                _token = yield alloc_managed_1.default(argument.time, argument.clear);
            }
            catch (e) {
                throw new apierror_1.default(-2, 'allocate an arc account failed');
            }
            const _return = {
                access_token: _token,
                valid_time: argument.time
            };
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
//# sourceMappingURL=alloc.js.map