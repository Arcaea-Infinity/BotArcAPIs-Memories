const TAG: string = 'database.arcsong.bysongid.ts';

import syslog from "../syslog/syslog";
import IDatabaseArcSong from "./interfaces/IDatabaseArcSong";

export default (songid: string): Promise<IDatabaseArcSong> => {

  const _sql: string =
    'SELECT * FROM `songs` WHERE `sid` == ?';
  syslog.v(TAG, _sql);

  // execute sql
  return DATABASE_ARCSONG.get(_sql, [songid])
    .then((data: any | null) => {

      if (!data) return null;

      data.rating_pst /= 10;
      data.rating_prs /= 10;
      data.rating_ftr /= 10;

      return <IDatabaseArcSong>data;

    });

}
