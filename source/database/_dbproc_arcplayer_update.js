// filename : database/_dbproc_arcplayer_update.js
// author   : TheSnowfield
// date     : 04/17/2020

const TAG = 'database/_dbproc_arcplayer_update.js';

module.exports = (userinfo) => {
  return new Promise((resolve, reject) => {

    // check database valid
    if (!DATABASE_ARCPLAYER) {
      return reject(new Error(`Invalid database? DATABASE_ARCPLAYER => ${JSON.stringify(DATABASE_ARCPLAYER)}`));
    }

    // always pack object to array
    let _wrapper = null;
    if (userinfo instanceof Array)
      _wrapper = userinfo;
    else
      _wrapper = [userinfo];

    // enum data and insert them
    _wrapper.forEach((element, index) => {
      // check data valid
      if (typeof element.user_id != 'number' ||
        typeof element.join_date != 'number' ||
        typeof element.name != 'string' ||
        typeof element.rating != 'number' ||
        typeof element.code != 'string') {
        return reject(new Error(`Invalid input data? userinfo => ${JSON.stringify(userinfo)}`));
      }

      const _sqlbinding = {
        uid: element.user_id,
        code: element.code,
        name: element.name,
        ptt: element.rating,
        join_date: element.join_date,
      };

      // this user ptt is hidden
      if (element.rating == -1)
        delete _sqlbinding.ptt;

      const _sql =
        `INSERT OR REPLACE INTO ` +
        `\`players\`(${Object.keys(_sqlbinding).join()}) ` +
        `VALUES(${new Array(Object.keys(_sqlbinding).length).fill('?').join(',')});`;
      syslog.v(TAG, _sql);

      // execute sql
      DATABASE_ARCPLAYER.run(_sql, Object.values(_sqlbinding))
        .then(() => {
          if (index == _wrapper.length - 1)
            resolve();
        })
        .catch((e) => { syslog.e(TAG, e.stack); reject(e); })
    });
  });
}