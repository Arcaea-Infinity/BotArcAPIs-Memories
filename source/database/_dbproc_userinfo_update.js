// filename : database/_dbproc_userinfo_update.js
// author   : CirnoBakaBOT
// date     : 04/10/2020

const TAG = 'database/_dbproc_userinfo_update.js';

module.exports = (userinfo) => {
  return new Promise((reslove, reject) => {

    // check data valid
    if (typeof userinfo.user_id != 'number' || typeof userinfo.join_date != 'number' ||
      typeof userinfo.name != 'string' || typeof userinfo.rating != 'number' ||
      typeof userinfo.code != 'string') {
      syslog.e(TAG, `Input data error? userinfo => ${JSON.stringify(userinfo)}`);
      return reject();
    }

    // this user ptt is hidden
    if (userinfo.rating == -1)
      return reslove();

    // check database valid
    if (!DATABASE_ARCPLAYER) {
      syslog.e(TAG, `Database error? DATABASE_ARCPLAYER => ${JSON.stringify(DATABASE_ARCPLAYER)}`);
      return reject();
    }

    const _sql =
      'INSERT OR REPLACE INTO `players`(id,join_date,name,rating,code) VALUES(?, ?, ?, ?, ?);';
    syslog.v(TAG, _sql);

    // execute sql
    DATABASE_ARCPLAYER.run(_sql, [
      userinfo.user_id,
      userinfo.join_date,
      userinfo.name,
      userinfo.rating,
      userinfo.code
    ])
      .then(reslove())
      .catch((e) => { syslog.e(TAG, e.stack); reject(e); })

  });
}