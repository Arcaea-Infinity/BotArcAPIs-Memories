const TAG: string = 'account/recycle.ts';

import syslog from '../syslog/syslog';
import IArcAccount from '../arcfetch/interfaces/IArcAccount';
import { ARCACCOUNT } from './account';

export default (account: IArcAccount) => {

  ARCACCOUNT.push(account);
  syslog.i(TAG, `Recycled account => ${account.name} ${account.token}`);

}
