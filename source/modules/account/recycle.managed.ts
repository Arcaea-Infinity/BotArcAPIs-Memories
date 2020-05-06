const TAG: string = 'account/recycle.auto.ts';

import syslog from '../syslog/syslog';
import account_recycle from './recycle';

export default (token: string): Promise<void> => {

  return new Promise((resolve, reject) => {

    // validate data
    if (!ARCPERSISTENT[token]) {
      syslog.w(TAG, `Invalid token => ${token}`);
      return reject(new Error('Invalid token'));
    }

    // recycle the account
    account_recycle(ARCPERSISTENT[token]);
    delete ARCPERSISTENT[token];

    resolve();

  });

}
