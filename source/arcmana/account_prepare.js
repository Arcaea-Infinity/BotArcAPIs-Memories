// filename : arcmana/_arcmana_account_prepare.js
// author   : TheSnowfield
// date     : 04/26/2020
// common   : request an arc account and add friend

const TAG = 'arcmana/_arcmana_account_prepare.js';

const arcapi_friend_add = require('../arcapi/friend_add');
const arcapi_friend_clear = require('../arcapi/friend_clear');
const arcmana_account_alloc = require('./account_alloc');
const arcmana_account_recycle = require('./account_recycle');

module.exports = (usercode = null) => {
  return new Promise(async (resolve, reject) => {

    let _account = null;
    const _return = {}

    // request an arc account
    try {
      _account = await arcmana_account_alloc();
      _return.account = _account;
    } catch (e) {
      return reject(new Error(-2, 'allocate an arc account failed'));
    }

    // clear friend list
    try {
      await arcapi_friend_clear(_account);
    } catch (e) {
      arcmana_account_recycle(_account);
      return reject(e);
    }

    // add friend
    if (usercode) {
      try {
        _return.friendlist = await arcapi_friend_add(_account, usercode);
      } catch (e) {
        arcmana_account_recycle(_account);
        return reject(e);
      }
    }

    resolve(_account);
  });
}