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
const TAG = 'v3/arc/recycle.js\t';
const syslog_1 = __importDefault(require("../../../modules/syslog/syslog"));
const apierror_1 = __importDefault(require("../../../modules/apierror/apierror"));
const recycle_managed_1 = __importDefault(require("../../../modules/account/recycle.managed"));
exports.default = (argument, method, path, header, databody) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let _access_token = null;
            if (argument.token) {
                _access_token = argument.token;
            }
            else if (header.authorization) {
                const _array = header.authorization.split(' ');
                if (_array.length == 2 && _array[0] == 'Bearer')
                    _access_token = _array[1];
            }
            if (!_access_token)
                throw new apierror_1.default(-1, 'invalid token');
            try {
                yield recycle_managed_1.default(_access_token);
            }
            catch (e) {
                throw new apierror_1.default(-2, 'invalid token');
            }
            resolve(null);
        }
        catch (e) {
            if (e instanceof apierror_1.default)
                return reject(e);
            syslog_1.default.e(TAG, e.stack);
            return reject(new apierror_1.default(-233, 'unknown error occurred'));
        }
    }));
};
//# sourceMappingURL=recycle.js.map