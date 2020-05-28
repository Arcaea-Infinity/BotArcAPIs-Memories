const TAG = 'account/alloc.managed.ts';

import crypto from 'crypto';
import account_alloc from './alloc';
import account_recycle_managed from './recycle.managed';
import arcapi_friend_clear from '../arcfetch/arcapi.friend.clear';
import IArcAccount from '../arcfetch/interfaces/IArcAccount';

export default (valid_time: number, clear: boolean = false): Promise<string> => {

  return new Promise(async (resolve, reject) => {

    // validate data
    if (valid_time < 30 || valid_time > 600)
      return reject(new Error('Invalid time'));

    // try to grab an account
    let _account: IArcAccount;
    try {
      _account = await account_alloc();
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
      account_recycle_managed(_token)
        .catch((e) => { /* do nothing */ });
    }, valid_time * 1000);

    resolve(_token);

  });

}
