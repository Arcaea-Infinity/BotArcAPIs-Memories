const TAG: string = 'database.arcrecord.byuserid.ts';

import syslog from "../syslog/syslog";
import IDatabaseArcRecord from './interfaces/IDatabaseArcRecord';

export default (userid: number, count: number): Promise<Array<IDatabaseArcRecord>> => {

  const _sql: string =
    'SELECT * FROM `records` WHERE `uid` == ? ' +
    'ORDER BY `time_played` DESC LIMIT ?';
  syslog.v(TAG, _sql);

  // execute sql
  return DATABASE_ARCRECORD.all(_sql, [userid, count])
    .then((data: Array<IDatabaseArcRecord> | null) => {
      if (!data) return null;

      return data.map((element) => {
        element.rating /= 10000;
        return element;
      });

    });;

}
