const TAG: string = 'account/recycle.ts';

import syslog from '@syslog';
import IArcAccount from '@arcfetch/interfaces/IArcAccount';

export default (account: IArcAccount) => {

  ARCACCOUNT.push(account);
  syslog.i(TAG, `Recycled account => ${account.name} ${account.token}`);

}
