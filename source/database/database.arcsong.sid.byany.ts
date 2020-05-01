export default (anystr: string): Promise<Array<string>> => {

  return new Promise(async (resolve, reject) => {

    // accurate querying an alias
    // such as 'AB' (Aterlbus) 'GL' (GrievousLady)
    try {

      const _sql: string =
        'SELECT * FROM `alias` WHERE `alias` LIKE ?';

      const _result: Array<IDatabaseArcSongAlias> | null =
        await DATABASE_ARCSONG.all(_sql, [anystr]);

      if (_result && _result.length == 1)
        return resolve([_result[0].sid]);

    } catch (e) { return reject(e); }


    // not found? then fuzzy querying
    // whole the database in 'name_en' 'name_jp' 'alias' 'songid'
    try {

      const _sql: string =
        'SELECT DISTINCT `sid` ' +
        'FROM (SELECT `sid`,`name_en`,`name_jp`,`alias` FROM `songs` LEFT JOIN `alias` USING (`sid`))' +
        'WHERE' +
        '`sid` LIKE ? OR ' +
        '`name_en` LIKE ? OR ' +
        '`name_jp` LIKE ? OR ' +
        '`alias` LIKE ?'

      const _result: Array<IDatabaseArcSong> | null =
        await DATABASE_ARCSONG.all(_sql, Array(4).fill(`%${anystr}%`));

      if (!_result || !_result.length)
        return reject(new Error('no such record'));

      // return all results
      resolve(_result.map((element) => {
        return element.sid;
      }));

    } catch (e) { return reject(e); }

  });

}
