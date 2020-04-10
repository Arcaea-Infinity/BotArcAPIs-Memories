// filename : corefunc/database.js
// author   : CirnoBakaBOT
// date     : 04/09/2020
// comment  : initialize databases and preare datatable

const TAG = 'corefunc/database.js';

const file = require('fs');
const path = require('path');
const database = require('sqlite-async');

module.exports = {
  initDataBases: () => {

    const _path_to_databases = path.resolve(__dirname, DATABASE_PATH);
    syslog.v(TAG, `Path to databases => ${_path_to_databases}`);

    const _first_create = !file.existsSync(_path_to_databases);
    syslog.v(TAG, `Database first creating? => ${_first_create}`);

    // create folder first
    // if database is first time creating
    if (_first_create) {
      file.mkdirSync(_path_to_databases);
    }


    //////////////////////////////////////////////////////////////////////////
    // database for arcaea accounts                                         //
    //////////////////////////////////////////////////////////////////////////
    _path_database_arcaccount = `${_path_to_databases}/arcaccount.db`;
    syslog.v(TAG, `Opening database => ${_path_database_arcaccount}`);

    database.open(_path_database_arcaccount, database.OPEN_READWRITE | database.OPEN_CREATE)
      .then((link) => {
        syslog.i(TAG, `arcaccount.db => OK`);

        // always execute this sql to keep datatable valid
        link.exec(
          "CREATE TABLE IF NOT EXISTS `accounts` ( \
            `arc_name` TEXT NOT NULL, `arc_pswd` TEXT NOT NULL, \
            `arc_uid` TEXT, `arc_ucode` TEXT, `arc_token` TEXT, `arc_banned` INTEGER, \
            PRIMARY KEY (`arc_name` ASC) \
          );"
        );

        // pre-read all arc account to queue
        syslog.v(TAG, `arcaccount.db => Loading arc accounts from database`);
        link.all('SELECT * FROM `accounts`')
          .then((result) => {

            // if has no arc account
            if (!result.length)
              syslog.w(TAG, 'There\'s no arc account in the database');
            else {

              // map to global space
              syslog.v(TAG, `arcaccount.db => Arc account(s) loaded: ${result.length}`);
              Object.defineProperty(global, 'ARCACCOUNTS',
                { value: result, writable: true, configurable: false });
            }
          });

        // close database
        syslog.v(TAG, `arcaccount.db => Close database`);
        link.close();

        // INSERT INTO `accounts` VALUES('test','12345678','0','000000001','tokentest','false')
      })
      .catch((e) => { syslog.f(TAG, `arcaccount.db => ${e.toString()}`); });


    //////////////////////////////////////////////////////////////////////////
    // database for arcaea best30 cache                                     //
    //////////////////////////////////////////////////////////////////////////
    _path_database_arcbest30 = `${_path_to_databases}/arcbest30.db`;
    syslog.v(TAG, `Opening database => ${_path_database_arcbest30}`);

    database.open(_path_database_arcbest30, database.OPEN_READWRITE | database.OPEN_CREATE)
      .then((link) => {
        syslog.i(TAG, `arcbest30.db => OK`);

        // always execute this sql to keep datatable valid
        link.exec(
          "CREATE TABLE IF NOT EXISTS `cache` ( \
            `uid` INTEGER NOT NULL, `last_played` INTEGER, \
            `best30_avg` INTEGER, `recent10_avg` INTEGER, `best30_list` TEXT, \
            PRIMARY KEY (`uid` ASC) \
          );"
        );

        // map to global space
        Object.defineProperty(global, 'DATABASE_ARCBEST30',
          { value: link, writable: false, configurable: false });

      })
      .catch((e) => { syslog.f(TAG, `arcbest30.db => ${e.toString()}`); });


    //////////////////////////////////////////////////////////////////////////
    // database for arcaea player's info                                    //
    //////////////////////////////////////////////////////////////////////////
    _path_database_arcplayer = `${_path_to_databases}/arcplayer.db`;
    syslog.v(TAG, `Opening database => ${_path_database_arcplayer}`);

    database.open(_path_database_arcplayer, database.OPEN_READWRITE | database.OPEN_CREATE)
      .then((link) => {
        syslog.i(TAG, `arcplayer.db => OK`);

        // always execute this sql to keep datatable valid
        link.exec(
          "CREATE TABLE IF NOT EXISTS `players` ( \
            `id` integer NOT NULL, `join_date` integer NOT NULL, \
            `name` text NOT NULL, `rating` integer NOT NULL, `code` text NOT NULL, \
            PRIMARY KEY (`id` ASC) \
          );"
        );

        // map to global space
        Object.defineProperty(global, 'DATABASE_ARCPLAYER',
          { value: link, writable: false, configurable: false });

      })
      .catch((e) => { syslog.f(TAG, `arcplayer.db => ${e.toString()}`); });


    //////////////////////////////////////////////////////////////////////////
    // database for arcaea player's record                                  //
    //////////////////////////////////////////////////////////////////////////
    const _path_database_arcrecord = `${_path_to_databases}/arcrecord.db`
    syslog.v(TAG, `Opening database => ${_path_database_arcrecord}`);

    database.open(_path_database_arcrecord, database.OPEN_READWRITE | database.OPEN_CREATE)
      .then((link) => {
        syslog.i(TAG, `arcrecord.db => OK`);

        // always execute this sql to keep datatable valid
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

        // map to global space
        Object.defineProperty(global, 'DATABASE_ARCRECORD',
          { value: link, writable: false, configurable: false });

      })
      .catch((e) => { syslog.f(TAG, `arcrecord.db => ${e.toString()}`); });

  },

  close: () => {
    DATABASE_ARCBEST30.close();
    DATABASE_ARCPLAYER.close();
    DATABASE_ARCRECORD.close();
  }
}
