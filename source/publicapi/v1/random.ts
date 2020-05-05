const TAG: string = 'v1/random.ts\t';

import syslog from '@syslog';
import APIError from '@apierror';
import arcsong_random from '@database/database.arcsong.byrand';
import arcsong_bysongid from '@database/database.arcsong.bysongid';

export default (argument: any): Promise<any> => {

  return new Promise(async (resolve, reject) => {

    try {

      // /random?start=xx[&end=xx][&info=true]
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

      let _arc_song: any = null;
      let _arc_songinfo: IDatabaseArcSong = <IDatabaseArcSong>{};
      let _return: any = {};

      // select song
      try {
        _arc_song = await arcsong_random(argument.start, argument.end);
        _return.id = _arc_song.sid;
        _return.rating_class = _arc_song.rating_class;
      } catch (e) { throw new APIError(-3, 'internal error'); }

      // return song info if needed
      if (argument.info == 'true') {
        
        try {
          _arc_songinfo = await arcsong_bysongid(_arc_song.sid);
          _return.song_info = {
            id: _arc_songinfo.sid,
            title_localized: {
              en: _arc_songinfo.name_en,
              ja: _arc_songinfo.name_jp
            },
            artist: _arc_songinfo.artist,
            bpm: _arc_songinfo.bpm,
            bpm_base: _arc_songinfo.bpm_base,
            set: _arc_songinfo.pakset,
            audioTimeSec: _arc_songinfo.time,
            side: _arc_songinfo.side,
            remote_dl: _arc_songinfo.remote_download == 'true' ? true : false,
            world_unlock: _arc_songinfo.world_unlock == 'true' ? true : false,
            date: _arc_songinfo.date,
            difficulties: [
              {
                ratingClass: 0,
                chartDesigner: _arc_songinfo.chart_designer_pst,
                jacketDesigner: _arc_songinfo.jacket_designer_pst,
                rating: _arc_songinfo.rating_pst
              },
              {
                ratingClass: 1,
                chartDesigner: _arc_songinfo.chart_designer_prs,
                jacketDesigner: _arc_songinfo.jacket_designer_prs,
                rating: _arc_songinfo.rating_prs
              },
              {
                ratingClass: 2,
                chartDesigner: _arc_songinfo.chart_designer_ftr,
                jacketDesigner: _arc_songinfo.jacket_designer_ftr,
                rating: _arc_songinfo.rating_ftr
              }
            ]
          };

          // remove empty field
          if (_return.song_info.title_localized.ja == "")
            delete _return.song_info.title_localized.ja;

        } catch (e) { throw new APIError(-4, 'internal error'); }

      }

      resolve(_return);

    } catch (e) {

      if (e instanceof APIError)
        return reject(e);

      syslog.e(TAG, e.stack);
      return reject(new APIError(-233, 'unknown error occurred'));

    }

  });

}
