const TAG: string = 'database.arcplayer.byany.ts';

import syslog from "../syslog/syslog";
import IDatabaseArcPlayer from "./interfaces/IDatabaseArcPlayer";

export default (user: string): Promise<IDatabaseArcPlayer[]> => {

  const _sql: string =
    'SELECT * FROM `players` WHERE `code` == ? OR `name`== ?';
  syslog.v(TAG, _sql);

  // execute sql
  return DATABASE_ARCPLAYER.all(_sql, [user, user]);

}
