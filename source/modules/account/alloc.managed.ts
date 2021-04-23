const TAG = 'account/alloc.managed.ts';

import crypto from 'crypto';
import syslog from '../syslog/syslog';
import account_alloc from './alloc';
import account_recycle_managed from './recycle.managed';
import arcapi_friend_clear from '../arcfetch/arcapi.friend.clear';
import IArcAccount from '../arcfetch/interfaces/IArcAccount';

export default (valid_time: number, clear: boolean = false): Promise<string> => {

  return new Promise(async (resolve, reject) => {

    // validate data
    if (valid_time < BOTARCAPI_FORWARD_TIMESEC_DEFAULT
      || valid_time > BOTARCAPI_FORWARD_TIMESEC_MAX)
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
    const _token: string = crypto.randomBytes(16).toString('hex');
    ARCPERSISTENT[_token] = {
      feed: 1, // must be 1
      feeded: 0,
      account: _account,
      validtime: valid_time * 1000
    };

    // start check
    check_recycle(_token);

    resolve(_token);

  });

}

const check_recycle = (token: string) => {

  // Validate the token
  if (!ARCPERSISTENT[token]) {
    syslog.w(TAG, 'Token not exists while recycling. Maybe it has been recycled manually? Canceled');
    return;
  }

  // Recycle the token
  if (--ARCPERSISTENT[token].feed < 0) {
    account_recycle_managed(token)
      .catch((e) => { /* do nothing */ });
    return;
  }

  // reset the timeout
  setTimeout(() => check_recycle(token), ARCPERSISTENT[token].validtime);
};
