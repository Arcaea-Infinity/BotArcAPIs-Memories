const TAG: string = 'database.arcsong.init.ts';

import syslog from "../syslog/syslog";

export default (): Promise<void> => {

  return Promise.resolve()

    // the 'songs' table
    .then(() => {

      const _sql: string =
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
        '`rating_byn` INTEGER NOT NULL DEFAULT 0,' +  // rating beyond

        '`difficultly_pst` INTEGER NOT NULL DEFAULT 0,' +  // difficultly past
        '`difficultly_prs` INTEGER NOT NULL DEFAULT 0,' +  // difficultly present
        '`difficultly_ftr` INTEGER NOT NULL DEFAULT 0,' +  // difficultly future
        '`difficultly_byn` INTEGER NOT NULL DEFAULT 0,' +  // difficultly beyond

        '`notes_pst` INTEGER NOT NULL DEFAULT 0, ' +  // notes past
        '`notes_prs` INTEGER NOT NULL DEFAULT 0, ' +  // notes present
        '`notes_ftr` INTEGER NOT NULL DEFAULT 0, ' +  // notes future
        '`notes_byn` INTEGER NOT NULL DEFAULT 0, ' +  // notes beyond

        '`chart_designer_pst` TEXT NOT NULL DEFAULT "",' +  // chart designer past
        '`chart_designer_prs` TEXT NOT NULL DEFAULT "",' +  // chart designer present
        '`chart_designer_ftr` TEXT NOT NULL DEFAULT "",' +  // chart designer future
        '`chart_designer_byn` TEXT NOT NULL DEFAULT "",' +  // chart designer beyond

        '`jacket_designer_pst` TEXT NOT NULL DEFAULT "",' +  // jacket designer past
        '`jacket_designer_prs` TEXT NOT NULL DEFAULT "",' +  // jacket designer present
        '`jacket_designer_ftr` TEXT NOT NULL DEFAULT "",' +  // jacket designer future
        '`jacket_designer_byn` TEXT NOT NULL DEFAULT "",' +  // jacket designer beyond

        'PRIMARY KEY ("sid" ASC))';
      syslog.v(TAG, _sql);

      return DATABASE_ARCSONG.exec(_sql);

    })

    // the 'alias' table
    .then(() => {

      const _sql: string =
        'CREATE TABLE IF NOT EXISTS `alias` (' +
        '`sid`    TEXT NOT NULL,' +
        '`alias`  TEXT NOT NULL,' +
        'PRIMARY KEY(`sid` ASC, `alias` ASC), ' +
        'FOREIGN KEY(`sid`) REFERENCES `songs`(`sid`))';
      syslog.v(TAG, _sql);

      return DATABASE_ARCSONG.exec(_sql);
    })

    // the 'charts' table
    .then(() => {

      const _sql: string =
        'CREATE TABLE IF NOT EXISTS `charts` (' +
        '`sid`          TEXT NOT NULL,' +
        '`rating_class` INTEGER NOT NULL CHECK(`rating_class` IN (0, 1, 2, 3)),' +
        '`difficultly`  INTEGER NOT NULL CHECK(`difficultly` != -1),' +
        '`rating`       INTEGER NOT NULL CHECK(`rating` != -1),' +
        'FOREIGN KEY(`sid`) REFERENCES `songs`(`sid`))';
      syslog.v(TAG, _sql);

      return DATABASE_ARCSONG.exec(_sql);

    });
}
