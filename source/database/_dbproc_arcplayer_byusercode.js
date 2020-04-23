// filename : database/_dbproc_arcplayer_byusercode.js
// author   : TheSnowfield
// date     : 04/24/2020

const TAG = 'database/_dbproc_arcplayer_byusercode.js';

module.exports = (usercode) => {
  return new Promise((resolve, reject) => {

    // validate data
    if (typeof usercode != 'string') {
      syslog.e(TAG, `Input data error? usercode => ${usercode}`);
      return reject(new Error('Invalid input data'));
    }

    const _sql = 'SELECT * FROM `players` WHERE `code` == ?';
    syslog.v(TAG, _sql);

    // execute sql
    DATABASE_ARCPLAYER.get(_sql, [usercode])
      .then((data) => { resolve(data); })
      .catch((e) => { syslog.e(TAG, e.stack); reject(e); });

    return _return_template;
  });
}