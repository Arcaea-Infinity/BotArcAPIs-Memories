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
const TAG = 'database.arcsong.sid.byany.ts';
const syslog_1 = __importDefault(require("../syslog/syslog"));
exports.default = (anystr) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const _sql = 'SELECT * FROM `alias` WHERE REPLACE(`alias`,\' \',\'\') LIKE REPLACE(?,\' \',\'\')';
            syslog_1.default.v(TAG, _sql);
            const _result = yield DATABASE_ARCSONG.all(_sql, [anystr]);
            if (_result && _result.length == 1)
                return resolve([_result[0].sid]);
        }
        catch (e) {
            return reject(e);
        }
        try {
            const _sql = 'SELECT DISTINCT `sid` ' +
                'FROM (SELECT `sid`,`name_en`,`name_jp`,`alias` FROM `songs` LEFT JOIN `alias` USING (`sid`))' +
                'WHERE' +
                '`sid` LIKE replace(?,\' \',\'\') OR ' +
                'replace(`name_en`,\' \',\'\') LIKE replace(?,\' \',\'\') OR ' +
                'replace(`name_jp`,\' \',\'\') LIKE replace(?,\' \',\'\') OR ' +
                'replace(`alias`,\' \',\'\') LIKE replace(?,\' \',\'\')';
            syslog_1.default.v(TAG, _sql);
            const _result = yield DATABASE_ARCSONG.all(_sql, Array(4).fill(`%${anystr}%`));
            if (!_result || !_result.length)
                return reject(new Error('no such record'));
            resolve(_result.map((element) => {
                return element.sid;
            }));
        }
        catch (e) {
            return reject(e);
        }
    }));
};
//# sourceMappingURL=database.arcsong.sid.byany.js.map