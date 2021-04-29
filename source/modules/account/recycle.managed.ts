const TAG: string = 'account/recycle.managed.ts';

import syslog from '../syslog/syslog';
import account_recycle from './recycle';

export default (token: string): Promise<void> => {

  return new Promise((resolve, reject) => {

    // validate data
    if (!ARCPERSISTENT[token]) {
      return reject(new Error('Invalid token or token has beed recycled'));
    }

    // recycle the account
    account_recycle(ARCPERSISTENT[token].account);

    // Clear timeout
    clearTimeout(ARCPERSISTENT[token].proc);

    // Remove it from persistent
    delete ARCPERSISTENT[token];

    resolve();

  });

}
