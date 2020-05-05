const TAG: string = 'database.arcaccount.init.ts';

import syslog from "../syslog/syslog";

export default (): Promise<void> => {

  const _sql: string =
    'CREATE TABLE IF NOT EXISTS `accounts` (' +
    '`name`   TEXT NOT NULL,' +
    '`passwd` TEXT NOT NULL,' +
    '`device` TEXT NOT NULL DEFAULT (LOWER(HEX(RANDOMBLOB(8)))),' +
    '`uid`    INTEGER DEFAULT 0,' +
    '`ucode`  TEXT DEFAULT "", ' +
    '`token`  TEXT DEFAULT "",' +
    '`banned` TEXT NOT NULL DEFAULT "false" CHECK(`banned` IN("true", "false")),' +
    'PRIMARY KEY (`name` ASC));';
  syslog.v(TAG, _sql);

  return DATABASE_ARCACCOUNT.exec(_sql);

}
