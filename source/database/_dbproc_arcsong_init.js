// filename : database/_dbproc_arcsong_init.js
// author   : CirnoBakaBOT
// date     : 04/15/2020

const TAG = 'database/_dbproc_arcsong_init.js';

module.exports = () => {
  return new Promise((resolve, reject) => {

    // execute sql
    const _sql =
      'CREATE TABLE IF NOT EXISTS `song`(' +
      '`id`       TEXT NOT NULL,' +                // song id

      '`name_en`  TEXT NOT NULL DEFAULT "",' +     // english name
      '`name_jp`  TEXT DEFAULT "",' +              // japanese name

      '`bpm`      TEXT NOT NULL DEFAULT "",' +    // bpm
      '`bpm_base` INTEGER NOT NULL DEFAULT 0,' +  // bpm base

      '`set`    TEXT NOT NULL DEFAULT "",' +     // songpack set
      '`artist` TEXT DEFAULT "",' +             // artist name
      '`time`   INTEGER NOT NULL DEFAULT 0,' +  // total time sec
      '`side`   INTEGER NOT NULL DEFAULT 0,' +   // side 0 hikari 1 conflict
      '`date`   INTEGER NOT NULL DEFAULT 0,' +  // release date

      '`world_unlock`     INTEGER DEFAULT 0,' +  // is world unlock
      '`remote_download`  INTEGER DEFAULT 0,' +  // is remote download

      '`rating_pst` INTEGER NOT NULL DEFAULT 0,' +  // rating past
      '`rating_prs` INTEGER NOT NULL DEFAULT 0,' +  // rating present
      '`rating_ftr` INTEGER NOT NULL DEFAULT 0,' +  // rating future

      '`difficultly_pst` INTEGER NOT NULL DEFAULT 0,' +  // difficultly past
      '`difficultly_prs` INTEGER NOT NULL DEFAULT 0,' +  // difficultly present
      '`difficultly_ftr` INTEGER NOT NULL DEFAULT 0,' +  // difficultly future

      '`chart_designer_pst` TEXT DEFAULT "",' +  // chart designer past
      '`chart_designer_prs` TEXT DEFAULT "",' +  // chart designer present
      '`chart_designer_ftr` TEXT DEFAULT "",' +  // chart designer future

      '`jacket_designer_pst` TEXT DEFAULT "",' +  // jacket designer past
      '`jacket_designer_prs` TEXT DEFAULT "",' +  // jacket designer present
      '`jacket_designer_ftr` TEXT DEFAULT "",' +  // jacket designer future

      'PRIMARY KEY ("id" ASC))';

    // execute sql
    DATABASE_ARCSONG.exec(_sql)
      .then(resolve())
      .catch((e) => { reject(e); });

  });
}