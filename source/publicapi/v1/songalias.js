// filename : v1/songalias.js
// author   : TheSnowfield
// date     : 02/05/2020

const TAG = 'v1/songalias.js';

const APIError = require('../../corefunc/error');

const dbproc_arcsong_sid_byany = require('../../procedures/arcsong_sid_byany');

module.exports = (argument) => {
  return new Promise(async (resolve, reject) => {

    try {

      // /songalias?songname=xxx
      // check for request arguments
      if (typeof argument.songname == 'undefined' || argument.songname == '')
        throw new APIError(-1, 'invalid songname');

      let _arc_songid = null;

      // query songid by any string
      try {
        _arc_songid = await dbproc_arcsong_sid_byany(argument.songname);
      } catch (e) { syslog.e(TAG, e.stack); throw new APIError(-2, 'this song is not recorded in the database'); }

      if (_arc_songid.length > 1)
        throw new APIError(-3, 'too many records');
      _arc_songid = _arc_songid[0];

      const _return = {
        id: _arc_songid,
      };

      resolve(_return);

    } catch (e) {
      if (e instanceof APIError)
        return reject(e);

      syslog.e(TAG, e.stack);
      return reject(new APIError(-233, 'unknown error occurred'));
    }
  });
}