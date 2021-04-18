const TAG: string = 'v4/song/rating.ts\t';

import syslog from '../../../modules/syslog/syslog';
import APIError from '../../../modules/apierror/apierror';
import arcsong_bysongrating from '../../../modules/database/database.arcsong.byrating';
import IDatabaseArcSongChart from "../../../modules/database/interfaces/IDatabaseArcSongChart";

export default (argument: any): Promise<any> => {

  return new Promise(async (resolve, reject) => {

    try {

      // /song/rating?start=xxx&end=xxx
      // check for request arguments
      if (typeof argument.start == 'undefined' || argument.start == '')
        throw new APIError(-1, 'invalid range start of the rating');

      if (typeof argument.end == 'undefined' || argument.end == '')
        argument.end = argument.start;

      if (argument.end < argument.start)
        throw new APIError(-2, 'range of rating end larger than its start');

      let _arc_charts: IDatabaseArcSongChart[] = [];

      try {
        _arc_charts = await arcsong_bysongrating(argument.start, argument.end);

      } catch (e) { }

      // make return results
      resolve({
        rating: _arc_charts.map((element) => {
          return {
            sid: element.sid,
            rating: element.rating / 10,
            rating_class: element.rating_class,
            difficulty: element.difficultly
          }
        })
      });

    } catch (e) {

      if (e instanceof APIError)
        return reject(e);

      syslog.e(TAG, e.stack);
      return reject(new APIError(-233, 'unknown error occurred'));

    }

  });

}
