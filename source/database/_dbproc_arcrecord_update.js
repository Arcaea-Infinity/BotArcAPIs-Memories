// filename : database/_dbproc_arcrecord_update.js
// author   : TheSnowfield
// date     : 04/10/2020

const TAG = 'database/_dbproc_arcrecord_update.js';

module.exports = (userid, record) => {
  return new Promise((resolve, reject) => {

    // check database valid
    if (!DATABASE_ARCRECORD) {
      syslog.e(TAG, `Database error? DATABASE_ARCRECORD => ${JSON.stringify(DATABASE_ARCRECORD)}`);
      return reject(new Error('Invalid database link'));
    }

    // always pack object to array
    let _wrapper = null;
    if (record instanceof Array)
      _wrapper = record;
    else
      _wrapper = [record];

    // enum data and insert them
    _wrapper.forEach((element, index) => {

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

      const _sqlbinding = {
        uid: userid,
        score: element.score,
        health: element.health,
        rating: parseInt(element.rating * 10000),
        song_id: element.song_id,
        modifier: element.modifier,
        difficulty: element.difficulty,
        clear_type: element.clear_type,
        best_clear_type: element.best_clear_type,
        time_played: element.time_played,
        near_count: element.near_count,
        miss_count: element.miss_count,
        perfect_count: element.perfect_count,
        shiny_perfect_count: element.shiny_perfect_count,
      };

      const _sql = 'INSERT OR IGNORE INTO ' +
        `\`records\`(${Object.keys(_sqlbinding).join()}) ` +
        `VALUES(${new Array(Object.keys(_sqlbinding).length).fill('?').join(',')});`;
      syslog.v(TAG, _sql);

      // execute sql
      DATABASE_ARCRECORD.run(_sql, Object.values(_sqlbinding))
        .then(() => {
          if (index == _wrapper.length - 1)
            resolve();
        })
        .catch((e) => { syslog.e(TAG, e.stack); reject(e); })

    });
  });
}