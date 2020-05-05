const TAG: string = 'database.arcbest30.byuid.ts';

import syslog from "@syslog";
import { atob } from 'abab';
import IArcBest30Result from "./interfaces/IArcBest30Result";
import IDatabaseArcBest30 from "./interfaces/IDatabaseArcBest30";

export default (userid: number): Promise<IArcBest30Result | null> => {

  const _sql: string =
    'SELECT * FROM `cache` WHERE `uid` == ?';
  syslog.v(TAG, _sql);

  // execute sql
  return DATABASE_ARCBEST30.get(_sql, [userid])
    .then((data: IDatabaseArcBest30 | null) => {

      return data ? {
        last_played: data.last_played,
        best30_avg: data.best30_avg / 10000,
        recent10_avg: data.recent10_avg / 10000,
        best30_list: JSON.parse(atob(data.best30_list) ?? '[]')
      } as IArcBest30Result : null;

    });

}
