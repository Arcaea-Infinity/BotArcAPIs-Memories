// filename : database.js
// author   : CirnoBakaBOT
// date     : 04/09/2020
// comment  : init database and preare datatable

const file = require('fs');
const path = require('path');
const database = require('sqlite-async');

module.exports.initDataBases = () => {

  const _path_to_databases = path.resolve(__dirname, DATABASE_PATH);
  const _first_create = !file.existsSync(_path_to_databases);

  // prepare folder if database first time creating
  if (_first_create) {
    file.mkdirSync(_path_to_databases);
  }

  // database for arcaea accounts
  _path_database_arcaccount = `${_path_to_databases}/arcaccount.db`;
  database.open(_path_database_arcaccount, database.OPEN_READWRITE | database.OPEN_CREATE)
    .then((link) => {
      link.exec(
        "CREATE TABLE IF NOT EXISTS `accounts` ( \
          `arc_name`  TEXT NOT NULL, `arc_pswd`  TEXT NOT NULL, \
          `arc_uid`  TEXT, `arc_ucode`  TEXT, `arc_token`  TEXT, `arc_banned`  INTEGER, \
          PRIMARY KEY (`arc_name` ASC) \
        );"
      );

      // pre-read all arc account to queue
      let _accounts = null;
      link.all('SELECT * FROM `accounts`', (err, rows) => {
        console.log(rows);
      })

      Object.defineProperty(global, 'ARCACCOUNTS',
        { value: _accounts, writable: true, configurable: false });

      // close database
      link.close();

      // INSERT INTO `accounts` VALUES('test','12345678','0','000000001','tokentest','false')
    })
    .catch((e) => { throw e; /*new Error(`open database => ${_path_database_arcaccount} failed`); */ });

  // database for arcaea best30 cache
  _path_database_arcbest30 = `${_path_to_databases}/arcbest30.db`;
  database.open(_path_database_arcbest30, database.OPEN_READWRITE | database.OPEN_CREATE)
    .then((link) => {
      link.exec(
        "CREATE TABLE IF NOT EXISTS `cache` ( \
          `uid` INTEGER NOT NULL, `last_played` INTEGER, \
          `best30_avg` INTEGER, `recent10_avg` INTEGER, `best30_list` TEXT, \
          PRIMARY KEY (`uid` ASC) \
        );"
      );
      Object.defineProperty(global, 'DATABASE_ARCBEST30',
        { value: link, writable: false, configurable: false });
    })
    .catch((e) => { throw e; /*new Error(`open database => ${_path_database_arcbest30} failed`); */ });

  // database for arcaea player's info
  _path_database_arcplayer = `${_path_to_databases}/arcplayer.db`;
  database.open(_path_database_arcplayer, database.OPEN_READWRITE | database.OPEN_CREATE)
    .then((link) => {
      link.exec(
        "CREATE TABLE IF NOT EXISTS `players` ( \
          `id` integer NOT NULL, `join_date` integer NOT NULL, \
          `name` text NOT NULL, `rating` integer NOT NULL, `code` text NOT NULL, \
          PRIMARY KEY (`id` ASC) \
        );"
      );
      Object.defineProperty(global, 'DATABASE_ARCPLAYER',
        { value: link, writable: false, configurable: false });
    })
    .catch((e) => { throw e;/* new Error(`open database => ${_path_database_arcplayer} failed`); */ });

  // database for arcaea player's record
  const _path_database_arcrecord = `${_path_to_databases}/arcrecord.db`
  database.open(_path_database_arcrecord, database.OPEN_READWRITE | database.OPEN_CREATE)
    .then((link) => {
      link.exec(
        "CREATE TABLE IF NOT EXISTS `records` ( \
          `hash` TEXT NOT NULL, `player` INTEGER NOT NULL, \
          `score` INTEGER NOT NULL, `health` INTEGER NOT NULL, \
          `rating` INTEGER NOT NULL, `song_id` TEXT NOT NULL, \
          `modifier` INTEGER NOT NULL, `difficulty` INTEGER NOT NULL, \
          `clear_type` INTEGER NOT NULL, `best_clear_type` INTEGER NOT NULL, \
          `time_played` INTEGER NOT NULL, `near_count` INTEGER NOT NULL, \
          `miss_count` INTEGER NOT NULL, `perfect_count` INTEGER NOT NULL, \
          `shiny_perfect_count` INTEGER NOT NULL\
        );"
      );
      Object.defineProperty(global, 'DATABASE_ARCRECORD',
        { value: link, writable: false, configurable: false });
    })
    .catch((e) => { throw e;/*new Error(`open database => ${_path_database_arcrecord} failed`)*/ });
}

/*
// must close all database link when exit
process.on('SIGINT', async function () {
  await DATABASE_ARCACCOUNT.close();
  await DATABASE_ARCBEST30.close();
  await DATABASE_ARCPLAYER.close();
  await DATABASE_ARCRECORD.close();
  //process.exit();
});
*/