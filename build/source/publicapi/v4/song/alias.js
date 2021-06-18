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
const TAG = 'v4/song/alias.ts\t';
const syslog_1 = __importDefault(require("../../../modules/syslog/syslog"));
const apierror_1 = __importDefault(require("../../../modules/apierror/apierror"));
const database_arcsong_alias_byid_1 = __importDefault(require("../../../modules/database/database.arcsong.alias.byid"));
exports.default = (argument) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (typeof argument.songid == 'undefined' || argument.songid == '')
                throw new apierror_1.default(-1, 'invalid song id');
            let _arc_alias;
            try {
                _arc_alias = yield database_arcsong_alias_byid_1.default(argument.songid);
            }
            catch (e) {
                throw new apierror_1.default(-2, 'internal error');
            }
            if (_arc_alias.length == 0)
                throw new apierror_1.default(-3, 'no result');
            resolve({ alias: _arc_alias.map((element) => { return element.alias; }) });
        }
        catch (e) {
            if (e instanceof apierror_1.default)
                return reject(e);
            syslog_1.default.e(TAG, e.stack);
            return reject(new apierror_1.default(-233, 'unknown error occurred'));
        }
    }));
};
//# sourceMappingURL=alias.js.map