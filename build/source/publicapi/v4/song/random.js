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
const TAG = 'v4/song/random.ts\t';
const syslog_1 = __importDefault(require("../../../modules/syslog/syslog"));
const apierror_1 = __importDefault(require("../../../modules/apierror/apierror"));
const database_arcsong_byrand_1 = __importDefault(require("../../../modules/database/database.arcsong.byrand"));
exports.default = (argument) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            argument.start = parseInt(argument.start);
            if (isNaN(argument.start))
                argument.start = 0;
            argument.end = parseInt(argument.end);
            if (isNaN(argument.end))
                argument.end = 0;
            if (argument.start == 0 && argument.end == 0) {
                argument.start = 2;
                argument.end = 23;
            }
            if (argument.start < 2 || argument.start > 23)
                throw new apierror_1.default(-1, 'invalid range of start');
            if (argument.end != 0 && (argument.end < argument.start || argument.end > 23))
                throw new apierror_1.default(-2, 'invalid range of end');
            let _arc_song = null;
            let _return = {};
            try {
                _arc_song = yield database_arcsong_byrand_1.default(argument.start, argument.end);
                _return.id = _arc_song.sid;
                _return.rating_class = _arc_song.rating_class;
            }
            catch (e) {
                throw new apierror_1.default(-3, 'internal error');
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
//# sourceMappingURL=random.js.map