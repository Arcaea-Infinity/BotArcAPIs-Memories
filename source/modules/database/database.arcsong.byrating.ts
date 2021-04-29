const TAG: string = 'database.arcsong.byrating.ts';

import syslog from "../syslog/syslog";
import IDatabaseArcSongChart from "./interfaces/IDatabaseArcSongChart";

export default (rating_start: number, rating_end: number | null)
  : Promise<IDatabaseArcSongChart[]> => {

  // convert rating data like database stored
  rating_start *= 10;
  rating_end = !rating_end ? rating_start : rating_end * 10;

  const _sql: string =
    'SELECT * FROM `charts` WHERE `rating` >= ? AND `rating` <= ? ORDER BY `rating` ASC';
  syslog.v(TAG, _sql);

  // execute sql
  return DATABASE_ARCSONG.all(_sql, [rating_start, rating_end]);

}
