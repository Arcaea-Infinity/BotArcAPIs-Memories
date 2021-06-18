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
const TAG = 'v4/song/rating.ts\t';
const syslog_1 = __importDefault(require("../../../modules/syslog/syslog"));
const apierror_1 = __importDefault(require("../../../modules/apierror/apierror"));
const database_arcsong_byrating_1 = __importDefault(require("../../../modules/database/database.arcsong.byrating"));
exports.default = (argument) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            argument.start = parseFloat(argument.start);
            if (isNaN(argument.start))
                throw new apierror_1.default(-1, 'invalid range start of the rating');
            if (argument.start <= 0 || argument.start > 15)
                throw new apierror_1.default(-2, 'invalid range start of the rating');
            if (isNaN(parseFloat(argument.end)))
                argument.end = argument.start;
            else
                argument.end = parseFloat(argument.end);
            if (argument.end <= 0 || argument.end > 15)
                throw new apierror_1.default(-3, 'invalid range end of the rating');
            if (argument.end < argument.start)
                throw new apierror_1.default(-4, 'range of rating end smaller than its start');
            let _arc_charts = [];
            try {
                _arc_charts = yield database_arcsong_byrating_1.default(argument.start, argument.end);
            }
            catch (e) {
                throw new apierror_1.default(-5, 'unknown error occurred');
            }
            resolve({
                rating: _arc_charts.map((element) => {
                    return {
                        sid: element.sid,
                        rating: element.rating / 10,
                        rating_class: element.rating_class,
                        difficulty: element.difficultly
                    };
                })
            });
        }
        catch (e) {
            if (e instanceof apierror_1.default)
                return reject(e);
            syslog_1.default.e(TAG, e.stack);
            return reject(new apierror_1.default(-233, 'unknown error occurred'));
        }
    }));
};
//# sourceMappingURL=rating.js.map