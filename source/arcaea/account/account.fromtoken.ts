import syslog from '../../corefunc/syslog';

const TAG: string = 'account/account.fromtoken.ts';
export default (token: string): Promise<IArcAccount> => {

  return new Promise((resolve, reject) => {

    // validate token
    if (!ARCPERSISTENT[token])
      return reject(new Error('Invalid token'));

    resolve(ARCPERSISTENT[token]);

  });

}
