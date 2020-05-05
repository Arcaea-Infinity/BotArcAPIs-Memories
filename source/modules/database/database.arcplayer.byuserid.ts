const TAG: string = 'database.arcplayer.byuserid.ts';

import syslog from "../syslog/syslog";
import IDatabaseArcPlayer from "./interfaces/IDatabaseArcPlayer";

export default (userid: number): Promise<IDatabaseArcPlayer | null> => {

  const _sql: string =
    'SELECT * FROM `players` WHERE `uid` == ?';
  syslog.v(TAG, _sql);

  // execute sql
  return DATABASE_ARCPLAYER.get(_sql, [userid]);

}
