const TAG: string = 'database.arcrecord.update.ts';

import syslog from "@syslog";
import IArcScore from "@modules/arcfetch/interfaces/IArcScore";

export default (userid: number,
  records: Array<IArcScore> | IArcScore): Promise<Array<void>> => {

  // always pack object to array
  let _wrapper: Array<IArcScore>;

  if (records instanceof Array)
    _wrapper = records;
  else
    _wrapper = [records];

  // enum data and insert them
  const _promises: Array<Promise<void>> =
    _wrapper.map((element) => {

      const _sqlbinding = {
        uid: userid,
        score: element.score,
        health: element.health,
        rating: Math.floor(element.rating * 10000),
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
      return DATABASE_ARCRECORD.run(_sql, Object.values(_sqlbinding));

    });

  return Promise.all(_promises);

}
