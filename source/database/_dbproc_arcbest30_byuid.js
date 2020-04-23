// filename : database/_dbproc_arcbest30_byuid.js
// author   : TheSnowfield
// date     : 04/22/2020

const TAG = 'database/_dbproc_arcbest30_byuid.js';

const atob = require('abab').atob;

module.exports = (userid) => {
  return new Promise((resolve, reject) => {

    const _sql = 'SELECT * FROM `cache` WHERE `uid` == ?';
    syslog.v(TAG, _sql);

    // execute sql
    DATABASE_ARCBEST30.get(_sql, [userid])
      .then((data) => {
        if (data) {
          data.best30_avg /= 10000;
          data.recent10_avg /= 10000;
          data.best30_list = JSON.parse(atob(data.best30_list));
        }
        resolve(data);
      })
      .catch((e) => { syslog.e(TAG, e.stack); reject(e); });
  });
}