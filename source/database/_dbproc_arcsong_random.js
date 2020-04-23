// filename : database/_dbproc_arcsong_random.js
// author   : TheSnowfield
// date     : 04/23/2020

const TAG = 'database/_dbproc_arcsong_random.js';

module.exports = (start, end) => {
  return new Promise(async (resolve, reject) => {

    // validate data
    if (typeof start != 'number' || typeof end != 'number') {
      syslog.d(typeof start, typeof end);
      syslog.e(TAG, `Input data error? start => ${start} end=>${end}`);
      return reject(new Error('Invalid input data'));
    }

    const _sql =
      'SELECT `sid`, `difficultly` FROM `charts` AS c WHERE ' +
      `${end == 0 ? `c.difficultly == ${start}` : `c.difficultly>=${start} AND c.difficultly<=${end}`} ` +
      'ORDER BY RANDOM() LIMIT 1';

    // execute sql
    DATABASE_ARCSONG.get(_sql)
      .then((data) => { resolve(data); })
      .catch((e) => { syslog.e(TAG, e.stack); reject(e); })
  });
}