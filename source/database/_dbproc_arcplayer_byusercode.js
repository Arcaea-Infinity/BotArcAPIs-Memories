// filename : database/_dbproc_arcplayer_byusercode.js
// author   : TheSnowfield
// date     : 04/10/2020

const TAG = 'database/_dbproc_arcplayer_byusercode.js';

module.exports = async (user_code) => {
  let _return_template = {
    success: false,
    user_info: null
  };

  // const database = require('sqlite-async');
  // const DATABASE_ARCPLAYER = database.open('', 0);

  // wait for promise
  await Promise.all([
    DATABASE_ARCPLAYER.get('SELECT * FROM `players` WHERE `code` == ?', [user_code])
  ])
    .then((data) => {
      if (data.length) {
        _return_template.success = true;
        _return_template.user_info = data[0];
      }
    })
    .catch((e) => { syslog.e(TAG, e) });

  return _return_template;
}