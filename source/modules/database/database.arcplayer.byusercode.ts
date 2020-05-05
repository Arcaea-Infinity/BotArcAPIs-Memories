const TAG: string = 'database.arcplayer.byusercode.ts';

import syslog from "../syslog/syslog";
import IDatabaseArcPlayer from "./interfaces/IDatabaseArcPlayer";

export default (usercode: string): Promise<IDatabaseArcPlayer | null> => {

  const _sql: string =
    'SELECT * FROM `players` WHERE `code` == ?';
  syslog.v(TAG, _sql);

  // execute sql
  return DATABASE_ARCPLAYER.get(_sql, [usercode]);

}
