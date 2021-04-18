const TAG: string = 'database.arcsong.alias.byid.ts';

import syslog from "../syslog/syslog";
import IDatabaseArcSongAlias from '../../modules/database/interfaces/IDatabaseArcSongAlias';

export default (songid: string): Promise<IDatabaseArcSongAlias[]> => {

  const _sql: string =
    'SELECT * FROM `alias` WHERE `sid` == ?';
  syslog.v(TAG, _sql);

  // execute sql
  return DATABASE_ARCSONG.all(_sql, [songid]);
}
