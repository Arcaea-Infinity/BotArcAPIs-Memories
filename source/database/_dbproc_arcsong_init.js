// filename : database/_dbproc_arcsong_init.js
// author   : TheSnowfield
// date     : 04/15/2020

const TAG = 'database/_dbproc_arcsong_init.js';

module.exports = () => {
  return Promise.resolve()

    // the 'songs' table
    .then(async () => {
      await new Promise((resolve, reject) => {
        const _sql =
          'CREATE TABLE IF NOT EXISTS `songs` (' +
          '`sid`       TEXT NOT NULL,' +    // song id

          '`name_en`  TEXT NOT NULL,' +     // english name
          '`name_jp`  TEXT NOT NULL DEFAULT "",' +   // japanese name

          '`bpm`      TEXT NOT NULL DEFAULT "",' +    // bpm
          '`bpm_base` INTEGER NOT NULL DEFAULT 0,' +  // bpm base

          '`pakset`    TEXT NOT NULL DEFAULT "",' +    // songpack set
          '`artist` TEXT NOT NULL DEFAULT "",' +             // artist name
          '`time`   INTEGER NOT NULL DEFAULT 0,' +  // total time sec
          '`side`   INTEGER NOT NULL CHECK(`side` IN(0, 1)) DEFAULT 0,' +  // side 0 hikari 1 conflict
          '`date`   INTEGER NOT NULL DEFAULT 0,' +  // release date

          '`world_unlock`     TEXT NOT NULL CHECK(`world_unlock` IN("true", "false")) DEFAULT "false",' +  // is world unlock
          '`remote_download`  TEXT NOT NULL CHECK(`remote_download` IN("true", "false")) DEFAULT "false",' +  // is remote download

          '`rating_pst` INTEGER NOT NULL DEFAULT 0,' +  // rating past
          '`rating_prs` INTEGER NOT NULL DEFAULT 0,' +  // rating present
          '`rating_ftr` INTEGER NOT NULL DEFAULT 0,' +  // rating future

          '`difficultly_pst` INTEGER NOT NULL DEFAULT 0,' +  // difficultly past
          '`difficultly_prs` INTEGER NOT NULL DEFAULT 0,' +  // difficultly present
          '`difficultly_ftr` INTEGER NOT NULL DEFAULT 0,' +  // difficultly future

          '`chart_designer_pst` TEXT NOT NULL DEFAULT "",' +  // chart designer past
          '`chart_designer_prs` TEXT NOT NULL DEFAULT "",' +  // chart designer present
          '`chart_designer_ftr` TEXT NOT NULL DEFAULT "",' +  // chart designer future

          '`jacket_designer_pst` TEXT NOT NULL DEFAULT "",' +  // jacket designer past
          '`jacket_designer_prs` TEXT NOT NULL DEFAULT "",' +  // jacket designer present
          '`jacket_designer_ftr` TEXT NOT NULL DEFAULT "",' +  // jacket designer future

          'PRIMARY KEY ("sid" ASC))';

        // execute sql
        DATABASE_ARCSONG.exec(_sql)
          .then(resolve())
          .catch((e) => { reject(e); });
      });
    })

    // the 'alias' table
    .then(async () => {
      await new Promise((resolve, reject) => {
        const _sql =
          'CREATE TABLE IF NOT EXISTS `alias` (' +
          '`sid`    TEXT NOT NULL,' +
          '`alias`  TEXT NOT NULL,' +
          'FOREIGN KEY(`sid`) REFERENCES `songs`(`sid`))';

        // execute sql
        DATABASE_ARCSONG.exec(_sql)
          .then(resolve())
          .catch((e) => { reject(e); });
      });
    });
}