// filename : database/_dbproc_arcbest30_update.js
// author   : TheSnowfield
// date     : 04/23/2020

const TAG = 'database/_dbproc_arcbest30_update.js';
const btoa = require('abab').btoa;

module.exports = (userid, best30) => {
  return new Promise((resolve, reject) => {

    // validate data
    if (typeof userid != 'number' ||
      typeof best30.last_played != 'number' ||
      typeof best30.best30_avg != 'number' ||
      typeof best30.recent10_avg != 'number' ||
      typeof best30.best30_list != 'object') {
      syslog.e(TAG, `Input data error? userid => ${userid} object => ${JSON.stringify(best30)}`);
      return reject(new Error('Invalid input data'));
    }

    const _sqlbinding = {
      uid: userid,
      last_played: parseInt(best30.last_played * 10000),
      best30_avg: parseInt(best30.best30_avg * 10000),
      recent10_avg: parseInt(best30.recent10_avg * 10000),
      best30_list: btoa(best30.best30_list),
    };

    const _sql = 'INSERT OR REPLACE INTO ' +
      `\`cache\`(${Object.keys(_sqlbinding).join()}) ` +
      `VALUES(${new Array(Object.keys(_sqlbinding).length).fill('?').join(',')});`;
    syslog.v(TAG, _sql);

    // execute sql
    DATABASE_ARCBEST30.exec(_sql)
      .then(resolve())
      .catch((e) => { syslog.e(TAG, e.stack); reject(e); });
  });
}
