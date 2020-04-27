// filename : arcmana/_arcmana_account_release.js
// author   : TheSnowfield
// date     : 04/11/2020
// common   : release an arc account

const TAG = 'arcmana/_arcmana_account_release.js';

module.exports = (account) => {
  return new Promise((resolve, reject) => {

    if (typeof ARCACCOUNT == 'undefined')
      return reject(new Error('ARCACCOUNT is undefined?'));
    if (typeof account == 'undefined')
      return reject(new Error('account is undefined?'));

    // push an account back to queue
    // ** pretend to be a queue =(:3) z)_ **
    ARCACCOUNT.push(account);

    resolve();
    syslog.i(TAG, `Released arc account => ${account.name} ${account.token}`);
  });
}