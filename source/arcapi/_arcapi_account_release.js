// filename : arcapi/_arcapi_account_release.js
// author   : TheSnowfield
// date     : 04/11/2020
// common   : release an arc account

const TAG = 'arcapi/_arcapi_account_release.js';

module.exports = (account) => {
  return new Promise((reslove, reject) => {

    if (typeof ARCACCOUNT == 'undefined')
      return reject();
    if (typeof account == 'undefined')
      return reject();

    // push an account back to queue
    // ** pretend to be a queue =(:3) z)_ **
    ARCACCOUNT.push(account);

    reslove();
    syslog.i(TAG, `Released arc account => ${account.name} ${account.token}`);
  });
}