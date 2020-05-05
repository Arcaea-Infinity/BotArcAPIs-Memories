const TAG: string = 'account/account.recycle.auto.ts';

import syslog from '@syslog';
import arcaea_account_recycle from './account.recycle';

export default (token: string): Promise<void> => {

  return new Promise((resolve, reject) => {

    // validate data
    if (!ARCPERSISTENT[token]) {
      syslog.w(TAG, `Invalid token => ${token}`);
      return reject(new Error('Invalid token'));
    }

    // recycle the account
    arcaea_account_recycle(ARCPERSISTENT[token]);
    delete ARCPERSISTENT[token];

    resolve();

  });

}
