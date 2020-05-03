export default (userid: number): Promise<IDatabaseArcPlayer | null> => {

  const _sql: string =
    'SELECT * FROM `players` WHERE `uid` == ?';

  // execute sql
  return DATABASE_ARCPLAYER.get(_sql, [userid]);

}
