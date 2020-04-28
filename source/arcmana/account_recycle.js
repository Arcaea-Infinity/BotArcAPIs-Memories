// filename : arcmana/account_recycle.js
// author   : TheSnowfield
// date     : 04/11/2020
// common   : recycle an arc account

const TAG = 'arcmana/account_recycle.js';

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
    syslog.i(TAG, `Recycled account => ${account.name} ${account.token}`);
  });
}