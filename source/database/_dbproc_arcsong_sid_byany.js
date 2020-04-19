// filename : database/_dbproc_arcsong_sid_byany.js
// author   : CirnoBakaBOT
// date     : 04/19/2020

const TAG = 'database/_dbproc_arcsong_sid_byany.js';

module.exports = (anystr) => {
  return new Promise(async (resolve, reject) => {

    // check data valid
    if (typeof anystr != 'string')
      return reject(new Error('wtf? invalid songid/songname/songalias'));

    let _result = null;

    // accurate querying an alias
    // such as 'AB' (Aterlbus) 'GL' (GrievousLady)
    try {
      const _sql = 'SELECT `sid` FROM `alias` WHERE `alias` LIKE ?';
      syslog.v(TAG, _sql);

      _result = await DATABASE_ARCSONG.all(_sql, [anystr]);

      // result only has one row
      // so found the result
      if (_result.length == 1)
        return resolve([_result[0].sid]);

    } catch (e) { syslog.e(TAG, e.stack); return reject(e); }


    // not found? so fuzzy querying
    // whole the database in 'name_en' 'name_jp' 'alias' 'songid'
    try {
      const _sql =
        'SELECT DISTINCT `sid` ' +
        'FROM (SELECT * FROM `alias` JOIN `songs` USING (`sid`))' +
        'WHERE' +
        '`sid` LIKE ? OR ' +
        '`name_en` LIKE ? OR ' +
        '`name_jp` LIKE ? OR ' +
        '`alias` LIKE ?'
      syslog.v(TAG, _sql);

      _result = await DATABASE_ARCSONG.all(_sql, Array(4).fill(`%${anystr}%`));

      // take out all data from object into array...
      // sucks.. wtf
      const _array = new Array(_result.length).fill(0);
      _array.forEach((x, y) => { _array[y] = _result[y].sid; });
      _result = _array;

    } catch (e) { syslog.e(TAG, e.stack); reject(e); }

    // return all results
    return resolve(_result);
  });
}

