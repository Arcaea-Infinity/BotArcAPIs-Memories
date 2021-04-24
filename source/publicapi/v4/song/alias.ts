const TAG: string = 'v4/song/alias.ts\t';

import syslog from '../../../modules/syslog/syslog';
import APIError from '../../../modules/apierror/apierror';
import IDatabaseArcSongAlias from '../../../modules/database/interfaces/IDatabaseArcSongAlias';

import arcsong_alias_bysid from '../../../modules/database/database.arcsong.alias.byid';

export default (argument: any): Promise<any> => {

  return new Promise(async (resolve, reject) => {

    try {

      // /song/alias?songid=xxx
      // validate request arguments
      if (typeof argument.songid == 'undefined' || argument.songid == '')
        throw new APIError(-1, 'invalid song id');

      let _arc_alias: IDatabaseArcSongAlias[];

      // search song alias with song id
      try {
        _arc_alias = await arcsong_alias_bysid(argument.songid);
      } catch (e) { throw new APIError(-2, 'internal error'); }

      if (_arc_alias.length == 0)
        throw new APIError(-3, 'no result');

      resolve({ alias: _arc_alias.map((element) => { return element.alias; }) });

    } catch (e) {

      if (e instanceof APIError)
        return reject(e);

      syslog.e(TAG, e.stack);
      return reject(new APIError(-233, 'unknown error occurred'));

    }

  });

}
