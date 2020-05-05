const TAG: string = 'account/fromtoken.ts';

import syslog from '@syslog';
import IArcAccount from '@arcfetch/interfaces/IArcAccount';

export default (token: string): Promise<IArcAccount> => {

  return new Promise((resolve, reject) => {

    // validate token
    if (!ARCPERSISTENT[token])
      return reject(new Error('Invalid token'));

    resolve(ARCPERSISTENT[token]);

  });

}
