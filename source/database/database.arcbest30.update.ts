import { btoa } from 'abab';

export default
  (userid: number, last_played: number, best30: IArcBest30Result) => {

    const _sqlbinding: IDatabaseArcBest30 = {
      uid: userid,
      last_played: last_played,
      best30_avg: Math.floor(best30.best30_avg * 10000),
      recent10_avg: Math.floor(best30.recent10_avg * 10000),
      best30_list: btoa(JSON.stringify(best30.best30_list)) ?? '[]',
    };

    const _sql: string =
      'INSERT OR REPLACE INTO ' +
      `\`cache\`(${Object.keys(_sqlbinding).join()}) ` +
      `VALUES(${new Array(Object.keys(_sqlbinding).length).fill('?').join(',')});`;

    // execute sql
    return DATABASE_ARCBEST30.run(_sql, Object.values(_sqlbinding));
    
  }
