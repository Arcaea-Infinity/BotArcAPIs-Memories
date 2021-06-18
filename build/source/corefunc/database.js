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
const TAG = 'corefunc/database.ts';
const fs_1 = __importDefault(require("fs"));
const sqlite_async_1 = __importDefault(require("sqlite-async"));
const syslog_1 = __importDefault(require("../modules/syslog/syslog"));
const database_arcaccount_init_1 = __importDefault(require("../modules/database/database.arcaccount.init"));
const database_arcaccount_all_1 = __importDefault(require("../modules/database/database.arcaccount.all"));
const database_arcbest30_init_1 = __importDefault(require("../modules/database/database.arcbest30.init"));
const database_arcrecord_init_1 = __importDefault(require("../modules/database/database.arcrecord.init"));
const database_arcplayer_init_1 = __importDefault(require("../modules/database/database.arcplayer.init"));
const database_arcsong_init_1 = __importDefault(require("../modules/database/database.arcsong.init"));
const database_arcsong_update_songlist_1 = __importDefault(require("../modules/database/database.arcsong.update.songlist"));
const initDataBases = () => {
    if (!fs_1.default.existsSync(DATABASE_PATH))
        fs_1.default.mkdirSync(DATABASE_PATH);
    const _database_arcaccount = 'arcaccount.db';
    const _path_database_arcaccount = `${DATABASE_PATH}/${_database_arcaccount}`;
    syslog_1.default.v(TAG, `Opening database => ${_path_database_arcaccount}`);
    sqlite_async_1.default.open(_path_database_arcaccount, sqlite_async_1.default.OPEN_READWRITE | sqlite_async_1.default.OPEN_CREATE)
        .then((link) => {
        Object.defineProperty(global, 'DATABASE_ARCACCOUNT', { value: link, writable: false, configurable: false });
        Object.freeze(DATABASE_ARCACCOUNT);
    })
        .then(() => __awaiter(void 0, void 0, void 0, function* () { yield database_arcaccount_init_1.default(); }))
        .then(() => {
        syslog_1.default.v(TAG, `${_database_arcaccount} => Loading arc accounts from database`);
        database_arcaccount_all_1.default()
            .then((result) => {
            if (!result.length) {
                syslog_1.default.w(TAG, `${_database_arcaccount} => There\'s no arc account in the database`);
                syslog_1.default.w(TAG, `${_database_arcaccount} => You must add ATLEAST ONE account to the database`);
            }
            Object.defineProperty(global, 'ARCACCOUNT', { value: result, writable: true, configurable: false });
            Object.defineProperty(global, 'ARCPERSISTENT', { value: {}, writable: true, configurable: false });
            for (let i = 0; i < result.length; ++i)
                syslog_1.default.v(TAG, `${_database_arcaccount} => ${result[i].name} ${result[i].token}`);
            syslog_1.default.i(TAG, `${_database_arcaccount} => Arc account(s) loaded: ${result.length}`);
        })
            .then(() => { syslog_1.default.i(TAG, `${_database_arcaccount} => OK`); })
            .catch((e) => { Promise.reject(e); });
    })
        .catch((e) => { syslog_1.default.f(TAG, `${_database_arcaccount} => ${e.toString()}`); });
    const _database_arcbest30 = 'arcbest30.db';
    const _path_database_arcbest30 = `${DATABASE_PATH}/${_database_arcbest30}`;
    syslog_1.default.v(TAG, `Opening database => ${_path_database_arcbest30}`);
    sqlite_async_1.default.open(_path_database_arcbest30, sqlite_async_1.default.OPEN_READWRITE | sqlite_async_1.default.OPEN_CREATE)
        .then((link) => {
        Object.defineProperty(global, 'DATABASE_ARCBEST30', { value: link, writable: false, configurable: false });
        Object.freeze(DATABASE_ARCBEST30);
    })
        .then(() => __awaiter(void 0, void 0, void 0, function* () { yield database_arcbest30_init_1.default(); }))
        .then(() => { syslog_1.default.i(TAG, `${_database_arcbest30} => OK`); })
        .catch((e) => { syslog_1.default.f(TAG, `${_database_arcbest30} => ${e.toString()}`); });
    const _database_arcplayer = 'arcplayer.db';
    const _path_database_arcplayer = `${DATABASE_PATH}/${_database_arcplayer}`;
    syslog_1.default.v(TAG, `Opening database => ${_path_database_arcplayer}`);
    sqlite_async_1.default.open(_path_database_arcplayer, sqlite_async_1.default.OPEN_READWRITE | sqlite_async_1.default.OPEN_CREATE)
        .then((link) => {
        Object.defineProperty(global, 'DATABASE_ARCPLAYER', { value: link, writable: false, configurable: false });
        Object.freeze(DATABASE_ARCPLAYER);
    })
        .then(() => __awaiter(void 0, void 0, void 0, function* () { yield database_arcplayer_init_1.default(); }))
        .then(() => { syslog_1.default.i(TAG, `${_database_arcplayer} => OK`); })
        .catch((e) => { syslog_1.default.f(TAG, `${_database_arcplayer} => ${e.toString()}`); });
    const _database_arcrecord = 'arcrecord.db';
    const _path_database_arcrecord = `${DATABASE_PATH}/${_database_arcrecord}`;
    syslog_1.default.v(TAG, `Opening database => ${_path_database_arcrecord}`);
    sqlite_async_1.default.open(_path_database_arcrecord, sqlite_async_1.default.OPEN_READWRITE | sqlite_async_1.default.OPEN_CREATE)
        .then((link) => {
        Object.defineProperty(global, 'DATABASE_ARCRECORD', { value: link, writable: false, configurable: false });
        Object.freeze(DATABASE_ARCRECORD);
    })
        .then(() => __awaiter(void 0, void 0, void 0, function* () { yield database_arcrecord_init_1.default(); }))
        .then(() => { syslog_1.default.i(TAG, `${_database_arcrecord} => OK`); })
        .catch((e) => { syslog_1.default.f(TAG, `${_database_arcrecord} => ${e.toString()}`); });
    const _database_arcsong = 'arcsong.db';
    const _path_database_arcsong = `${DATABASE_PATH}/${_database_arcsong}`;
    syslog_1.default.v(TAG, `Opening database => ${_path_database_arcsong}`);
    sqlite_async_1.default.open(_path_database_arcsong, sqlite_async_1.default.OPEN_READWRITE | sqlite_async_1.default.OPEN_CREATE)
        .then((link) => {
        Object.defineProperty(global, 'DATABASE_ARCSONG', { value: link, writable: false, configurable: false });
        Object.freeze(DATABASE_ARCSONG);
    })
        .then(() => __awaiter(void 0, void 0, void 0, function* () { yield database_arcsong_init_1.default(); }))
        .then(() => __awaiter(void 0, void 0, void 0, function* () {
        const _path_to_songlist = `${DATABASE_PATH}/songlist`;
        if (fs_1.default.existsSync(_path_to_songlist)) {
            syslog_1.default.i(TAG, 'songlist file detected... updating database');
            yield fs_1.default.promises.readFile(_path_to_songlist)
                .then((file) => __awaiter(void 0, void 0, void 0, function* () {
                let root = null;
                try {
                    root = JSON.parse(file.toString());
                }
                catch (e) {
                    throw e;
                }
                yield database_arcsong_update_songlist_1.default(root);
            }))
                .catch((e) => { throw e; });
        }
    }))
        .then(() => { syslog_1.default.i(TAG, `${_database_arcsong} => OK`); })
        .catch((e) => { syslog_1.default.f(TAG, `${_database_arcsong} => ${e.toString()}`); });
};
const close = () => {
    try {
        DATABASE_ARCACCOUNT.close();
        DATABASE_ARCBEST30.close();
        DATABASE_ARCPLAYER.close();
        DATABASE_ARCRECORD.close();
        DATABASE_ARCSONG.close();
    }
    catch (e) { }
};
exports.default = { initDataBases, close };
//# sourceMappingURL=database.js.map