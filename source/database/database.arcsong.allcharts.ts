export default (): Promise<Array<IDatabaseArcSongChart> | null> => {

  const _sql: string =
    'SELECT * FROM `charts` ORDER BY `rating` DESC';

  // execute sql
  return DATABASE_ARCSONG.all(_sql)
    .then((data: Array<IDatabaseArcSongChart> | null) => {
      if (!data) return null;

      return data.map((element) => {
        return element.rating /= 10;
      });

    });

}