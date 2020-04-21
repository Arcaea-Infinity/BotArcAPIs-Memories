// filename : database/_dbproc_arcbest30_init.js
// author   : TheSnowfield
// date     : 04/15/2020

const TAG = 'database/_dbproc_arcbest30_init.js';

module.exports = () => {
  return new Promise((resolve, reject) => {

    const _sql =
      'CREATE TABLE IF NOT EXISTS `cache` (' +
      '`uid`          INTEGER NOT NULL,' +
      '`last_played`  INTEGER NOT NULL DEFAULT 0,' +
      '`best30_avg`   INTEGER NOT NULL DEFAULT 0,' +
      '`recent10_avg` INTEGER NOT NULL DEFAULT 0,' +
      '`best30_list`  TEXT DEFAULT "",' +
      'PRIMARY KEY (`uid` ASC));';

    // execute sql
    DATABASE_ARCBEST30.exec(_sql)
      .then(resolve())
      .catch((e) => { reject(e); });
  });
}