export default (): Promise<void> => {

  const _sql: string =
    'CREATE TABLE IF NOT EXISTS `players` (' +
    '`uid`  INTEGER NOT NULL,' +       // user id
    '`code` TEXT NOT NULL,' +          // user code
    '`name` TEXT NOT NULL,' +          // user name
    '`ptt`  INTEGER DEFAULT -1,' +     // user ptt
    '`join_date` INTEGER NOT NULL,' +  // join date
    'PRIMARY KEY (`uid` ASC));';

  // execute sql
  return DATABASE_ARCPLAYER.exec(_sql);

}
