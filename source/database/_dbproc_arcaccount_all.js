// filename : database/_dbproc_arcaccount_load.js
// author   : TheSnowfield
// date     : 04/15/2020

module.exports = () => {
  return new Promise((resolve, reject) => {

    const _sql = 'SELECT * FROM `accounts` WHERE `banned` == "false"';

    // execute sql
    DATABASE_ARCACCOUNT.all(_sql)
      .then((data) => {
        if (data) {
          data.forEach((_, index) => {
            // all banned accounts has been filtered by sql
            // so assign the false value directly
            data[index].banned = false;
          });
        }
        resolve(data);
      })
      .catch((e) => { reject(e); });
  });
}
