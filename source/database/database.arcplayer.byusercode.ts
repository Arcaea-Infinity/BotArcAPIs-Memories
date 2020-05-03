export default (usercode: string): Promise<IDatabaseArcPlayer | null> => {

  const _sql: string =
    'SELECT * FROM `players` WHERE `code` == ?';

  // execute sql
  return DATABASE_ARCPLAYER.get(_sql, [usercode]);

}
