// filename : database/_dbproc_arcaccount_load.js
// author   : TheSnowfield
// date     : 04/26/2020

const TAG = 'database/_dbproc_arcaccount_load.js';

module.exports = (account) => {
  return new Promise((resolve, reject) => {

    // validate data
    if (typeof account.name != 'string' ||
      typeof account.passwd != 'string' ||
      typeof account.device != 'string' ||
      typeof account.uid != 'number' ||
      typeof account.ucode != 'string' ||
      typeof account.token != 'string' ||
      typeof account.banned != 'boolean') {
      return reject(new Error(`Invalid input data? account => ${JSON.stringify(account)}`));
    }

    const _sqlbinding = {
      passwd: account.passwd,
      device: account.device,
      uid: account.uid,
      ucode: account.ucode,
      token: account.token,
      banned: account.banned ? 'true' : 'false',
      name: account.name // the last argument
    };

    const _binding_updates = (() => {
      let _array = [];
      Object.keys(_sqlbinding).forEach((v) => {
        if (v != 'name')
          _array.push(`${v} = ?`);
      });
      return _array.join(', ');
    })();

    const _sql = 'UPDATE `accounts` ' +
      `SET ${_binding_updates} WHERE \`name\` == ?`;
    syslog.v(TAG, _sql);

    // execute sql
    DATABASE_ARCACCOUNT.run(_sql, Object.values(_sqlbinding))
      .then(resolve())
      .catch((e) => { syslog.e(TAG, e.stack); reject(e); });
  });
}
