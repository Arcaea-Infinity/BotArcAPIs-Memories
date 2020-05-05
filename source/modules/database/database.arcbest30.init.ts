const TAG: string = 'database.arcbest30.byuid.ts';

import syslog from "@syslog";

export default (): Promise<void> => {

  const _sql =
    'CREATE TABLE IF NOT EXISTS `cache` (' +
    '`uid`          INTEGER NOT NULL,' +
    '`last_played`  INTEGER NOT NULL DEFAULT 0,' +
    '`best30_avg`   INTEGER NOT NULL DEFAULT 0,' +
    '`recent10_avg` INTEGER NOT NULL DEFAULT 0,' +
    '`best30_list`  TEXT DEFAULT "",' +
    'PRIMARY KEY (`uid` ASC));';
  syslog.v(TAG, _sql);

  // execute sql
  return DATABASE_ARCBEST30.exec(_sql);
  
}
