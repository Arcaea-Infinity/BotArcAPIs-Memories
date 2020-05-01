import { atob } from 'abab';

export default (userid: string): Promise<IArcBest30Result | null> => {

  const _sql: string =
    'SELECT * FROM `cache` WHERE `uid` == ?';

  // execute sql
  return DATABASE_ARCBEST30.get(_sql, [userid])
    .then((data: IDatabaseArcBest30 | null) => {
      return data ? {
        best30_avg: data.best30_avg / 10000,
        recent10_avg: data.recent10_avg / 10000,
        best30_list: JSON.parse(atob(data.best30_list) ?? '[]')
      } as IArcBest30Result : null;
    });

}
