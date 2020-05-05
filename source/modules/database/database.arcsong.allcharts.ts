const TAG: string = 'database.arcsong.allcharts.ts';

import syslog from "../syslog/syslog";
import IDatabaseArcSongChart from "./interfaces/IDatabaseArcSongChart";

export default (): Promise<Array<IDatabaseArcSongChart> | null> => {

  const _sql: string =
    'SELECT * FROM `charts` ORDER BY `rating` DESC';
  syslog.v(TAG, _sql);

  // execute sql
  return DATABASE_ARCSONG.all(_sql)
    .then((data: Array<IDatabaseArcSongChart> | null) => {
      if (!data) return null;

      return data.map((element) => {
        element.rating /= 10;
        return element;
      });

    });

}
