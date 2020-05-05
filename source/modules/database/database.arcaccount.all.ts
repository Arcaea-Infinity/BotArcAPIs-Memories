const TAG: string = 'database.arcaccount.all.ts';

import syslog from "@syslog";
import IArcAccount from "@arcfetch/interfaces/IArcAccount";
import IDatabaseArcAccount from "./interfaces/IDatabaseArcAccount";

export default (): Promise<Array<IArcAccount> | null> => {

  const _sql: string =
    'SELECT * FROM `accounts` WHERE `banned` == "false"';
  syslog.v(TAG, _sql);

  // execute sql
  return DATABASE_ARCACCOUNT.all(_sql)
    .then((data: Array<IDatabaseArcAccount> | null) => {

      if (!data) return null;

      let _account: Array<any> = data;
      _account.forEach((_, index) => {
        _account[index].banned == 'false' ? false : true
      });

      return <Array<IArcAccount>>_account;

    });

}
