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
const TAG = 'tests/index.ts';
const config_1 = __importDefault(require("../source/corefunc/config"));
const syslog_1 = __importDefault(require("../source/modules/syslog/syslog"));
const database_1 = __importDefault(require("../source/corefunc/database"));
const database_arcsong_allcharts_1 = __importDefault(require("../source/modules/database/database.arcsong.allcharts"));
(function main() {
    config_1.default.loadConfigs();
    process.title = `${BOTARCAPI_VERSTR}`;
    syslog_1.default.startLogging();
    config_1.default.printConfigs();
    database_1.default.initDataBases();
    setTimeout(() => __awaiter(this, void 0, void 0, function* () {
        const charts = yield database_arcsong_allcharts_1.default();
        if (charts)
            console.log(JSON.stringify(charts[0]));
    }), 1000);
})();
//# sourceMappingURL=index.js.map