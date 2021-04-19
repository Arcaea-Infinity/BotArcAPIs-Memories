const TAG: string = 'v4/song/random.ts\t';

import syslog from  '../../../modules/syslog/syslog';
import APIError from  '../../../modules/apierror/apierror';
import arcsong_random from  '../../../modules/database/database.arcsong.byrand';

export default (argument: any): Promise<any> => {

  return new Promise(async (resolve, reject) => {

    try {

      // /song/random?start=xx[&end=xx]
      // check for request arguments
      argument.start = parseInt(argument.start);
      if (isNaN(argument.start)) argument.start = 0;
      argument.end = parseInt(argument.end);
      if (isNaN(argument.end)) argument.end = 0;

      // default range
      // 1 1+ 2 2+ ... 10 10+ 11
      if (argument.start == 0 && argument.end == 0) {
        argument.start = 2;
        argument.end = 23;
      }

      if (argument.start < 2 || argument.start > 23)
        throw new APIError(-1, 'invalid range of start');
      if (argument.end != 0 && (argument.end < argument.start || argument.end > 23))
        throw new APIError(-2, 'invalid range of end');

      let _arc_song: any = null;
      let _return: any = {};

      // select song
      try {
        _arc_song = await arcsong_random(argument.start, argument.end);
        _return.id = _arc_song.sid;
        _return.rating_class = _arc_song.rating_class;
      } catch (e) { throw new APIError(-3, 'internal error'); }

      resolve(_return);

    } catch (e) {

      if (e instanceof APIError)
        return reject(e);

      syslog.e(TAG, e.stack);
      return reject(new APIError(-233, 'unknown error occurred'));

    }

  });

}
