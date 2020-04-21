// filename : database/_dbproc_arcrecord_init.js
// author   : TheSnowfield
// date     : 04/15/2020

const TAG = 'database/_dbproc_arcrecord_init.js';

module.exports = () => {
  return new Promise((resolve, reject) => {

    const _sql =
      'CREATE TABLE IF NOT EXISTS `records` (' +
      '`uid` INTEGER NOT NULL,' +
      '`score` INTEGER NOT NULL,' +
      '`health` INTEGER NOT NULL,' +
      '`rating` INTEGER NOT NULL,' +
      '`song_id` TEXT NOT NULL,' +
      '`modifier` INTEGER NOT NULL,' +
      '`difficulty` INTEGER NOT NULL,' +
      '`clear_type` INTEGER NOT NULL,' +
      '`best_clear_type` INTEGER NOT NULL,' +
      '`time_played` INTEGER NOT NULL,' +
      '`near_count` INTEGER NOT NULL,' +
      '`miss_count` INTEGER NOT NULL,' +
      '`perfect_count` INTEGER NOT NULL,' +
      '`shiny_perfect_count` INTEGER NOT NULL, ' +
      'PRIMARY KEY ("uid" ASC, "song_id" ASC, "time_played" ASC));';

    // execute sql
    DATABASE_ARCRECORD.exec(_sql)
      .then(resolve())
      .catch((e) => { reject(e); });
  });
}