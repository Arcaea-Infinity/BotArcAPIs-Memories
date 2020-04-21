// filename : database/_dbproc_arcplayer_init.js
// author   : TheSnowfield
// date     : 04/15/2020

const TAG = 'database/_dbproc_arcplayer_init.js';

module.exports = () => {
  return new Promise((resolve, reject) => {

    const _sql =
      'CREATE TABLE IF NOT EXISTS `players` (' +
      '`uid`  INTEGER NOT NULL,' +       // user id
      '`code` TEXT NOT NULL,' +          // user code
      '`name` TEXT NOT NULL,' +          // user name
      '`ptt`  INTEGER DEFAULT -1,' +     // user ptt
      '`join_date` INTEGER NOT NULL,' +  // join date
      'PRIMARY KEY (`uid` ASC));';

    // execute sql
    DATABASE_ARCPLAYER.exec(_sql)
      .then(resolve())
      .catch((e) => { reject(e); });
  });
}