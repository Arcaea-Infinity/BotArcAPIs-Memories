export default (songid: string): Promise<IDatabaseArcSong> => {

  const _sql: string =
    'SELECT * FROM `songs` WHERE `sid` == ?';

  // execute sql
  return DATABASE_ARCSONG.get(_sql, [songid])
    .then((data: IDatabaseArcSong | null) => {

      if (!data) return null;

      data.difficultly_pst /= 10;
      data.difficultly_prs /= 10;
      data.difficultly_ftr /= 10;

      return data;

    });

}
