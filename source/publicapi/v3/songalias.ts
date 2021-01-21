const TAG: string = 'v3/songalias.ts\t';

import syslog from '../../modules/syslog/syslog';
import APIError from '../../modules/apierror/apierror';
import arcsong_sid_byany from '../../modules/database/database.arcsong.sid.byany';

export default (argument: any): Promise<any> => {

  return new Promise(async (resolve, reject) => {

    try {

      // /songalias?songname=xxx
      // validate request arguments
      if (typeof argument.songname == 'undefined' || argument.songname == '')
        throw new APIError(-1, 'invalid songname');

      let _arc_songid: Array<string>;

      // query songid by any string
      try {
        _arc_songid = await arcsong_sid_byany(argument.songname);
      } catch (e) { throw new APIError(-2, 'no result'); }

      if (_arc_songid.length > 1)
        throw new APIError(-3, 'too many records');

      resolve({ id: _arc_songid[0] });

    } catch (e) {

      if (e instanceof APIError)
        return reject(e);

      syslog.e(TAG, e.stack);
      return reject(new APIError(-233, 'unknown error occurred'));

    }

  });

}
