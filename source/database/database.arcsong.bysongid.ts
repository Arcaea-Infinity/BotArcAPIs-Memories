export default (songid: string): Promise<IArcSong> => {

  const _sql: string =
    'SELECT * FROM `songs` WHERE `sid` == ?';

  // execute sql
  return DATABASE_ARCSONG.get(_sql, [songid])
    .then((data: IDatabaseArcSong | null) => {

      if (!data) return null;

      const _song: any = data;
      _song.rating_pst /= 10;
      _song.rating_prs /= 10;
      _song.rating_ftr /= 10;

      return <IArcSong>_song;

    });

}
