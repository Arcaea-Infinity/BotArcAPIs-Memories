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
const TAG = 'v3/connect.ts\t';
const crypto_1 = __importDefault(require("crypto"));
exports.default = (argument) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const _date = new Date();
        const _table = 'qwertyuiopasdfghjklzxcvbnm1234567890';
        const _secret = _date.getUTCFullYear() + 'ori' +
            _date.getUTCMonth() + 'wol' +
            _date.getUTCDate() + 'oihs' +
            _date.getUTCDate() + 'otas';
        const _hash = crypto_1.default.createHash('md5').update(_secret).digest('hex');
        let _result = '';
        for (let i = 0; i < _hash.length; ++i) {
            _result += _table[_hash[i].charCodeAt(0) % 36];
        }
        const _return = `${_result[1]}${_result[20]}${_result[4]}${_result[30]}${_result[2]}${_result[11]}${_result[23]}`;
        resolve({ key: _return });
    }));
};
//# sourceMappingURL=connect.js.map