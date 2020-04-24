// filename : database/_dbproc_arcsong_charts_all.js
// author   : TheSnowfield
// date     : 04/24/2020

const TAG = 'database/_dbproc_arcsong_charts_all.js';

module.exports = () => {
  return new Promise((resolve, reject) => {

    const _sql = 'SELECT * FROM `charts` ORDER BY `rating` DESC';

    // execute sql
    DATABASE_ARCSONG.all(_sql)
      .then((data) => {
        if (data) {
          data.forEach((_, index) => {
            data[index].rating /= 10;
          });
        }
        resolve(data);
      })
      .catch((e) => { syslog.e(TAG, e.stack); reject(e); });
  });
}