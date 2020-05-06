const TAG: string = 'database.arcaccount.all.ts';

import syslog from "../syslog/syslog";
import IArcAccount from "../arcfetch/interfaces/IArcAccount";

export default (): Promise<Array<IArcAccount> | null> => {

  const _sql: string =
    'SELECT * FROM `accounts` WHERE `banned` == "false"';
  syslog.v(TAG, _sql);

  // execute sql
  return DATABASE_ARCACCOUNT.all(_sql)
    .then((data: Array<IArcAccount> | null) => {

      if (!data) return null;

      return data.map((element) => {
        element.banned == 'true' ? true : false
        return element;
      });

    });

}
