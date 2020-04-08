// filename : sqlite3.js
// author   : CirnoBakaBOT
// date     : 04/09/2020
// comment  : init database and preare datatable

const File = require('fs');
const Path = require('path');
const Sqlite3 = require('sqlite3');

const _path_save = Path.resolve(__dirname, DATABASE_PATH);
const _first_create = !File.existsSync(_path_save);

// prepare folder if database first time creating
if (_first_create) {
  File.mkdirSync(_path_save);
}

let _database_arcaccount = null;
let _database_arcbest30 = null;
let _database_arcplayer = null;
let _database_arcrecord = null;

try {
  // database for arcaea accounts
  _database_arcaccount = new Sqlite3.Database(
    `${_path_save}/arcaccount.db`,
    Sqlite3.OPEN_READWRITE | Sqlite3.OPEN_CREATE
  );

  // database for arcaea best30 cache
  _database_arcbest30 = new Sqlite3.Database(
    `${_path_save}/arcbest30.db`,
    Sqlite3.OPEN_READWRITE | Sqlite3.OPEN_CREATE
  );

  // database for arcaea player's info
  _database_arcplayer = new Sqlite3.Database(
    `${_path_save}/arcplayer.db`,
    Sqlite3.OPEN_READWRITE | Sqlite3.OPEN_CREATE
  );

  // database for arcaea player's played records
  _database_arcrecord = new Sqlite3.Database(
    `${_path_save}/arcrecord.db`,
    Sqlite3.OPEN_READWRITE | Sqlite3.OPEN_CREATE
  );
} catch (e) {
  throw new Error('open database failed...');
}

// prepare datatables if first time creating
if (_first_create) {
  try {
    _database_arcaccount.exec(
      "CREATE TABLE `accounts` ( \
        `arc_name`  TEXT NOT NULL, \
        `arc_pswd`  TEXT NOT NULL, \
        `arc_uid`  TEXT, \
        `arc_ucode`  TEXT, \
        `arc_token`  TEXT, \
        `arc_banned`  INTEGER, \
        PRIMARY KEY (`arc_name` ASC) \
      );"
    );

    _database_arcbest30.exec(
      "CREATE TABLE `cache` ( \
        `uid` INTEGER NOT NULL, \
        `last_played` INTEGER, \
        `best30_avg` INTEGER, \
        `recent10_avg` INTEGER, \
        `best30_list` TEXT, \
        PRIMARY KEY (`uid` ASC) \
      );"
    );

    _database_arcplayer.exec(
      "CREATE TABLE `players` ( \
        `id` integer NOT NULL, \
        `join_date` integer NOT NULL, \
        `name` text NOT NULL, \
        `rating` integer NOT NULL, \
        `code` text NOT NULL, \
        PRIMARY KEY (`id` ASC) \
      );"
    );

    _database_arcrecord.exec(
      "CREATE TABLE `records` ( \
        `hash` TEXT NOT NULL, \
        `player` INTEGER NOT NULL, \
        `score` INTEGER NOT NULL, \
        `health` INTEGER NOT NULL, \
        `rating` INTEGER NOT NULL, \
        `song_id` TEXT NOT NULL, \
        `modifier` INTEGER NOT NULL, \
        `difficulty` INTEGER NOT NULL, \
        `clear_type` INTEGER NOT NULL, \
        `best_clear_type` INTEGER NOT NULL, \
        `time_played` INTEGER NOT NULL, \
        `near_count` INTEGER NOT NULL, \
        `miss_count` INTEGER NOT NULL, \
        `perfect_count` INTEGER NOT NULL, \
        `shiny_perfect_count` INTEGER NOT NULL\
      );"
    );
  } catch (e) {
    throw new Error('create datatable failed...');
  }
}

// initialized with no errors!
// map database link to global space
Object.defineProperty(global,
  'DATABASE_ARCACCOUNT',
  { value: _database_arcaccount, writable: false, configurable: false }
);
Object.defineProperty(global,
  'DATABASE_ARCBEST30',
  { value: _database_arcbest30, writable: false, configurable: false }
);
Object.defineProperty(global,
  'DATABASE_ARCPLAYER',
  { value: _database_arcplayer, writable: false, configurable: false }
);
Object.defineProperty(global,
  'DATABASE_ARCRECORD',
  { value: _database_arcrecord, writable: false, configurable: false }
);
