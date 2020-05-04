import syslog from '@syslog';

const TAG: string = 'account/account.recycle.ts';
export default (account: IArcAccount) => {

  ARCACCOUNT.push(account);
  syslog.i(TAG, `Recycled account => ${account.name} ${account.token}`);

}
