// filename : database/_dbproc_record_update.js
// author   : CirnoBakaBOT
// date     : 04/10/2020

const TAG = 'database/_dbproc_record_update.js';

module.exports = (userid, records) => {
  return new Promise((reslove, reject) => {

    records.forEach((element, index) => {

      // check data valid
      if (typeof userid != 'number' ||
        typeof element.score != 'number' ||
        typeof element.health != 'number' ||
        typeof element.rating != 'number' ||
        typeof element.song_id != 'string' ||
        typeof element.modifier != 'number' ||
        typeof element.difficulty != 'number' ||
        typeof element.clear_type != 'number' ||
        typeof element.best_clear_type != 'number' ||
        typeof element.time_played != 'number' ||
        typeof element.near_count != 'number' ||
        typeof element.miss_count != 'number' ||
        typeof element.perfect_count != 'number' ||
        typeof element.shiny_perfect_count != 'number') {
        syslog.e(TAG, `Input data error? record => ${JSON.stringify(element)}`);
        return reject(new Error('Invalid input data'));
      }

      // check database valid
      if (!DATABASE_ARCRECORD) {
        syslog.e(TAG, `Database error? DATABASE_ARCPLAYER => ${JSON.stringify(DATABASE_ARCRECORD)}`);
        return reject(new Error('Invalid database link'));
      }

      const _sql = 'INSERT OR REPLACE INTO ' +
        '`records`(player,score,health,rating,song_id,modifier,difficulty,clear_type,' +
        'best_clear_type,time_played,near_count,miss_count,perfect_count,shiny_perfect_count) ' +
        'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?);';
      syslog.v(TAG, _sql);

      // execute sql
      DATABASE_ARCRECORD.run(_sql, [
        userid,
        element.score,
        element.health,
        parseInt(element.rating * 10000),
        element.song_id,
        element.modifier,
        element.difficulty,
        element.clear_type,
        element.best_clear_type,
        element.time_played,
        element.near_count,
        element.miss_count,
        element.perfect_count,
        element.shiny_perfect_count,
      ])
        .then(() => {
          if (index == records.length - 1)
            reslove();
        })
        .catch((e) => { reject(e); })

    });
  });
}