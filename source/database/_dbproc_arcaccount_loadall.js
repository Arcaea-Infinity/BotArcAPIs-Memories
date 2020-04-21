// filename : database/_dbproc_arcaccount_load.js
// author   : TheSnowfield
// date     : 04/15/2020

module.exports = () => {
  return new Promise((resolve, reject) => {

    const _sql = 'SELECT * FROM `accounts`';

    // execute sql
    DATABASE_ARCACCOUNT.all(_sql)
      .then((d) => { return resolve(d); })
      .catch((e) => { reject(e); });
  });
}