// filename : database/_dbproc_arcsong_bysongid.js
// author   : TheSnowfield
// date     : 04/18/2020

const TAG = 'database/_dbproc_arcsong_bysongid.js';

module.exports = (songid) => {
  return new Promise((resolve, reject) => {

    // check data valid
    if (typeof songid != 'string')
      reject(new Error('wtf? invalid songid'));

    const _sql = 'SELECT * FROM `songs` WHERE `sid` == ?';
    syslog.v(TAG, _sql);

    // execute sql
    DATABASE_ARCSONG.get(_sql, [songid])
      .then((data) => {
        if (data) {
          data.rating_pst /= 10;
          data.rating_prs /= 10;
          data.rating_ftr /= 10;
        }
        resolve(data);
      })
      .catch((e) => { syslog.e(TAG, e.stack); reject(e); })
  });
}
