// filename : procedures/arcplayer_byuserid.js
// author   : TheSnowfield
// date     : 04/24/2020

const TAG = 'procedures/arcplayer_byuserid.js';

module.exports = (userid) => {
  return new Promise((resolve, reject) => {

    // validate data
    if (typeof userid != 'number') {
      syslog.e(TAG, `Input data error? userid => ${userid}`);
      return reject(new Error('Invalid input data'));
    }

    const _sql = 'SELECT * FROM `players` WHERE `uid` == ?';
    syslog.v(TAG, _sql);

    // execute sql
    DATABASE_ARCPLAYER.get(_sql, [userid])
      .then((data) => { resolve(data); })
      .catch((e) => { syslog.e(TAG, e.stack); reject(e); });

    return _return_template;
  });
}
