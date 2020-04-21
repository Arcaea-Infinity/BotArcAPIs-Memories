// filename : database/_dbproc_arcaccount_init.js
// author   : TheSnowfield
// date     : 04/15/2020

const TAG = 'database/_dbproc_arcaccount_init.js';

module.exports = () => {
  return new Promise((resolve, reject) => {

    const _sql =
      'CREATE TABLE IF NOT EXISTS `accounts` (' +
      '`name`   TEXT NOT NULL,' +
      '`passwd` TEXT NOT NULL,' +
      '`device` TEXT NOT NULL DEFAULT (LOWER(HEX(RANDOMBLOB(8)))),' +
      '`uid`    INTEGER DEFAULT 0,' +
      '`ucode`  TEXT DEFAULT "", ' +
      '`token`  TEXT DEFAULT "",' +
      '`banned` TEXT NOT NULL DEFAULT "false" CHECK(`banned` IN("true", "false")),' +
      'PRIMARY KEY (`name` ASC));';

    // execute sql
    DATABASE_ARCACCOUNT.exec(_sql)
      .then(resolve())
      .catch((e) => { reject(e); });
  });
}