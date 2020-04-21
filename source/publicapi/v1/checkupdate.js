// filename : v1/checkupdate.js
// date     : 02/10/2020
// comment  : checkupdate

const TAG = 'v1/checkupdate.js';

const fetch = require('node-fetch');
const Request = require('node-fetch').Request;
const APIError = require('../../corefunc/error');

module.exports = () => {
  return new Promise(async (resolve, reject) => {

    try {

      // construct remote request
      const _remote_request =
        new Request('https://www.fantasyroom.cn/api/v1/arcver.php', {
          method: 'GET',
          headers: {
            'User-Agent': 'BotArcAPI'
          }
        });

      // request remote service
      fetch(_remote_request)
        .then((response) => {
          // parse json if success
          if (response.status === 200)
            return response.json();
          throw new APIError(-1, 'remote service now is unavailable');
        })
        .then((root) => {
          // check result if success
          if (root.res === 'success') {
            const _return = {};
            _return.version = root.contents.android.version;
            _return.download_link = root.contents.android.apk_dl_link;
            return resolve(_return);
          }
          throw new APIError(-2, 'request remote service failed');
        })
        .catch((e) => { throw new APIError(-3, 'request timeout'); });

    } catch (e) {
      if (e instanceof APIError)
        return reject(e);

      syslog.e(TAG, e.stack);
      return reject(new APIError(-233, 'unknown error occurred'));
    }
  });
};
