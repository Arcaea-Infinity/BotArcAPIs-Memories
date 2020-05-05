const TAG: string = 'database.arcbest30.update.ts';

import { btoa } from 'abab';
import syslog from "../syslog/syslog";
import IArcBest30Result from './interfaces/IArcBest30Result';
import IDatabaseArcBest30 from './interfaces/IDatabaseArcBest30';

export default (userid: number, best30: IArcBest30Result) => {

  const _sqlbinding: IDatabaseArcBest30 = {
    uid: userid,
    last_played: best30.last_played,
    best30_avg: Math.floor(best30.best30_avg * 10000),
    recent10_avg: Math.floor(best30.recent10_avg * 10000),
    best30_list: btoa(JSON.stringify(best30.best30_list)) ?? '[]',
  };

  const _sql: string =
    'INSERT OR REPLACE INTO ' +
    `\`cache\`(${Object.keys(_sqlbinding).join()}) ` +
    `VALUES(${new Array(Object.keys(_sqlbinding).length).fill('?').join(',')});`;
  syslog.v(TAG, _sql);

  // execute sql
  return DATABASE_ARCBEST30.run(_sql, Object.values(_sqlbinding));

}
