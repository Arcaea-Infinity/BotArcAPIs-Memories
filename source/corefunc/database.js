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
    const _database_arcaccount = 'arcaccount.db';
    const _path_database_arcaccount = `${_path_to_databases}/${_database_arcaccount}`;
    syslog.v(TAG, `Opening database => ${_path_database_arcaccount}`);

    database.open(_path_database_arcaccount, database.OPEN_READWRITE | database.OPEN_CREATE)
      .then((link) => {
        syslog.i(TAG, `${_database_arcaccount} => OK`);

        // always execute this sql to keep datatable valid
        link.exec(
          "CREATE TABLE IF NOT EXISTS `accounts` ( \
            `arc_name` TEXT NOT NULL, `arc_pswd` TEXT NOT NULL, \
            `arc_uid` TEXT, `arc_ucode` TEXT, `arc_token` TEXT, `arc_banned` INTEGER, \
            PRIMARY KEY (`arc_name` ASC) \
          );"
        );

        // pre-read all arc account to queue
        syslog.v(TAG, `${_database_arcaccount} => Loading arc accounts from database`);
        link.all('SELECT * FROM `accounts`')
          .then((result) => {

            // if has no arc account
            if (!result.length)
              syslog.w(TAG, 'There\'s no arc account in the database');
            else {

              // map to global space
              syslog.v(TAG, `${_database_arcaccount} => Arc account(s) loaded: ${result.length}`);
              Object.defineProperty(global, 'ARCACCOUNTS',
                { value: result, writable: true, configurable: false });
            }
          });

        // close database
        syslog.v(TAG, `${_database_arcaccount} => Close database`);
        link.close();

        // INSERT INTO `accounts` VALUES('test','12345678','0','000000001','tokentest','false')
      })
      .catch((e) => { syslog.f(TAG, `${_database_arcaccount} => ${e.toString()}`); });


    //////////////////////////////////////////////////////////////////////////
    // database for arcaea best30 cache                                     //
    //////////////////////////////////////////////////////////////////////////
    const _database_arcbest30 = 'arcbest30.db';
    const _path_database_arcbest30 = `${_path_to_databases}/${_database_arcbest30}`;
    syslog.v(TAG, `Opening database => ${_path_database_arcbest30}`);

    database.open(_path_database_arcbest30, database.OPEN_READWRITE | database.OPEN_CREATE)
      .then((link) => {
        syslog.i(TAG, `${_database_arcbest30} => OK`);

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
      .catch((e) => { syslog.f(TAG, `${_database_arcbest30} => ${e.toString()}`); });


    //////////////////////////////////////////////////////////////////////////
    // database for arcaea player's info                                    //
    //////////////////////////////////////////////////////////////////////////
    const _database_arcplayer = 'arcplayer.db';
    const _path_database_arcplayer = `${_path_to_databases}/${_database_arcplayer}`;
    syslog.v(TAG, `Opening database => ${_path_database_arcplayer}`);

    database.open(_path_database_arcplayer, database.OPEN_READWRITE | database.OPEN_CREATE)
      .then((link) => {
        syslog.i(TAG, `${_database_arcplayer} => OK`);

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
      .catch((e) => { syslog.f(TAG, `${_database_arcplayer} => ${e.toString()}`); });


    //////////////////////////////////////////////////////////////////////////
    // database for arcaea player's record                                  //
    //////////////////////////////////////////////////////////////////////////
    const _database_arcrecord = 'arcrecord.db';
    const _path_database_arcrecord = `${_path_to_databases}/${_database_arcrecord}`
    syslog.v(TAG, `Opening database => ${_path_database_arcrecord}`);

    database.open(_path_database_arcrecord, database.OPEN_READWRITE | database.OPEN_CREATE)
      .then((link) => {
        syslog.i(TAG, `${_database_arcrecord} => OK`);

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
      .catch((e) => { syslog.f(TAG, `${_database_arcrecord} => ${e.toString()}`); });

  },

  close: () => {
    DATABASE_ARCBEST30.close();
    DATABASE_ARCPLAYER.close();
    DATABASE_ARCRECORD.close();
  }
}
