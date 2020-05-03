// filename : arcmana/account_allocauto.js
// author   : TheSnowfield
// date     : 04/28/2020
// common   : request arc account and auto recycle when timed out

const TAG = 'arcmana/account_allocauto.js';

const crypto = require('crypto');
const arcapi_friend_clear = require('../arcapi/friend_clear');
const arcmana_account_alloc = require('./account_alloc');
const arcmana_account_recycleauto = require('./account_recycleauto');

module.exports = (valid_time, clear = false) => {
  return new Promise(async (resolve, reject) => {

    // validate data
    if (valid_time < 30 || valid_time > 600)
      return reject(new Error('Invalid time'));

    // try to grab an account
    try {
      _account = await arcmana_account_alloc();
    } catch (e) { return reject(new Error('Allocate account failed')); }

    // clear friends
    if (clear) {
      try {
        await arcapi_friend_clear(_account);
      } catch (e) { return reject(new Error('Clear friend failed')); }
    }

    // save account to persistent list
    const _token = crypto.randomBytes(16).toString('hex');
    ARCPERSISTENT[_token] = _account;

    // timed out to auto recycle the account
    setTimeout(() => {
      arcmana_account_recycleauto(_token);
    }, valid_time * 1000);

    resolve(_token);
  });
}
