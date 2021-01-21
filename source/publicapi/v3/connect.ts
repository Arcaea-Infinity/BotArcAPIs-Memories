const TAG: string = 'v3/connect.ts\t';

import syslog from '../../modules/syslog/syslog';
import APIError from '../../modules/apierror/apierror';
import crypto from 'crypto';

export default (argument: any): Promise<any> => {

  return new Promise(async (resolve, reject) => {

    const _date: Date = new Date();
    const _table = 'qwertyuiopasdfghjklzxcvbnm1234567890';

    const _secret =
      _date.getUTCFullYear() + 'ori' +
      _date.getUTCMonth() + 'wol' +
      _date.getUTCDate() + 'oihs' +
      _date.getUTCDate() + 'otas';

    // calculate md5 hash
    const _hash = crypto.createHash('md5').update(_secret).digest('hex');

    let _result = '';
    for (let i = 0; i < _hash.length; ++i) {
      _result += _table[_hash[i].charCodeAt(0) % 36];
    }

    const _return = `${_result[1]}${_result[20]}${_result[4]}${_result[30]}${_result[2]}${_result[11]}${_result[23]}`;

    resolve({ key: _return });
  });

}
