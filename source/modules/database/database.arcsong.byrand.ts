const TAG: string = 'database.arcsong.byrand.ts';

import syslog from "../syslog/syslog";

export default (start: number, end: number): Promise<any> => {

  const _sqlbinding: any = {
    start: start,
    end: end
  };

  if (end == 0)
    delete _sqlbinding.end;

  const _sql: string =
    'SELECT `sid`, `rating_class` FROM `charts` AS c WHERE ' +
    `${end == 0 ? `c.difficultly==?` : `c.difficultly>=? AND c.difficultly<=?`} ` +
    'ORDER BY RANDOM() LIMIT 1';
  syslog.v(TAG, _sql);

  // execute sql
  return DATABASE_ARCSONG.get(_sql, Object.values(_sqlbinding));

}
