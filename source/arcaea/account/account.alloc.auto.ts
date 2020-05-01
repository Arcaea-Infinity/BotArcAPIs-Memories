import crypto from 'crypto';
import account_alloc from './account.alloc';
import account_recycleauto from './account.recycle.auto';

export default
  (valid_time: number): Promise<string> => {
    
    return new Promise(async (resolve, reject) => {

      // validate data
      if (valid_time < 30 || valid_time > 600)
        return reject(new Error('Invalid time'));

      // try to grab an account
      let _account: IArcAccount;
      try {
        _account = await account_alloc();
      } catch (e) { return reject('Allocate account failed'); }

      // save account to persistent list
      const _token = crypto.randomBytes(16).toString('hex');
      ARCPERSISTENT[_token] = _account;

      // timed out to auto recycle the account
      setTimeout(() => {
        account_recycleauto(_token);
      }, valid_time * 1000);

      resolve(_token);
    });
  }
