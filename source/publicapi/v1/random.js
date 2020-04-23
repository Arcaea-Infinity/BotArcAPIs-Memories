// filename : v1/random.js
// author   : TheSnowfield
// date     : 04/23/2020
// comment  : api for random song selection

const TAG = 'v1/random.js\t';

const APIError = require('../../corefunc/error');
const dbproc_arcsong_random = require('../../database/_dbproc_arcsong_random');

module.exports = (argument) => {
  return new Promise(async (resolve, reject) => {

    try {

      // /random?start=xx[&end=xx]
      // check for request arguments
      argument.start = parseInt(argument.start);
      if (isNaN(argument.start)) argument.start = 0;
      argument.end = parseInt(argument.end);
      if (isNaN(argument.end)) argument.end = 0;

      // default range
      if (argument.start == 0 && argument.end == 0) {
        argument.start = 1;
        argument.end = 11;
      }

      if (argument.start < 1 || argument.start > 11)
        throw new APIError(-1, 'invalid range of start');
      if (argument.end != 0 && (argument.end < argument.start || argument.end > 11))
        throw new APIError(-2, 'invalid range of end');

      let _arc_song = null;

      // select song
      try {
        _arc_song = await dbproc_arcsong_random(argument.start, argument.end);
      } catch (e) { throw new APIError(-3, 'internal error'); }

      const _return = {
        id: _arc_song.sid,
        rating_class: _arc_song.rating_class
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
