const TAG: string = 'database.arcsong.update.songlist.ts';

import syslog from "../syslog/syslog";
import IArcSongList from "./interfaces/IArcSongList";
import IDatabaseArcSong from "./interfaces/IDatabaseArcSong";

export default (songlist: IArcSongList): Promise<void> => {

  return Promise.resolve()

    // do update 'songs' table
    .then(() => {

      const _promises: Array<Promise<void>> =
        songlist.songs.map((element) => {

          const _sqlbinding: IDatabaseArcSong = {
            sid: element.id,
            name_en: element.title_localized.en,
            name_jp: element.title_localized.ja ?? '',
            bpm: element.bpm,
            bpm_base: element.bpm_base,
            pakset: element.set,
            artist: element.artist,
            side: element.side,
            date: element.date,
            version: element.version ?? '',
            world_unlock: element.world_unlock == true ? 'true' : 'false',
            remote_download: element.remote_dl == true ? 'true' : 'false',
            difficultly_pst: element.difficulties[0].rating * 2,
            difficultly_prs: element.difficulties[1].rating * 2,
            difficultly_ftr: element.difficulties[2].rating * 2,
            difficultly_byn: element.difficulties[3] ? element.difficulties[3].rating * 2 : -1,
            chart_designer_pst: element.difficulties[0].chartDesigner,
            chart_designer_prs: element.difficulties[1].chartDesigner,
            chart_designer_ftr: element.difficulties[2].chartDesigner,
            chart_designer_byn: element.difficulties[3] ? element.difficulties[3].chartDesigner : '',
            jacket_designer_pst: element.difficulties[0].jacketDesigner,
            jacket_designer_prs: element.difficulties[1].jacketDesigner,
            jacket_designer_ftr: element.difficulties[2].jacketDesigner,
            jacket_designer_byn: element.difficulties[3] ? element.difficulties[3].jacketDesigner : '',
            jacket_override_pst: element.difficulties[0].jacketOverride == true ? 'true' : 'false',
            jacket_override_prs: element.difficulties[1].jacketOverride == true ? 'true' : 'false',
            jacket_override_ftr: element.difficulties[2].jacketOverride == true ? 'true' : 'false',
            jacket_override_byn: (element.difficulties[3] && element.difficulties[3].jacketOverride == true) ? 'true' : 'false',
          };

          // processing "ratingPlus"
          if (element.difficulties[0]?.ratingPlus == true)
            ++_sqlbinding.difficultly_pst;
          if (element.difficulties[1]?.ratingPlus == true)
            ++_sqlbinding.difficultly_prs;
          if (element.difficulties[2]?.ratingPlus == true)
            ++_sqlbinding.difficultly_ftr;
          if (element.difficulties[3]?.ratingPlus == true)
            ++_sqlbinding.difficultly_byn;

          const _binding_keys: string =
            Object.keys(_sqlbinding).join();

          const _binding_vals: string =
            new Array(Object.keys(_sqlbinding).length).fill('?').join(',');

          const _binding_conflicts: string = (() => {
            let _array: Array<string> = [];
            Object.keys(_sqlbinding).forEach((v, i) => {
              if (v != 'sid')
                _array.push(`${v} = excluded.${v}`);
            });
            return _array.join(', ');
          })();

          const _sql: string =
            'INSERT INTO ' +
            `\`songs\`(${_binding_keys}) VALUES(${_binding_vals})` +
            `ON CONFLICT(\`sid\`) DO UPDATE SET ${_binding_conflicts}`
          syslog.v(TAG, _sql);

          // execute sql
          return DATABASE_ARCSONG.run(_sql, Object.values(_sqlbinding));

        });

      return Promise.all(_promises);

    })

    // then do update 'chart' table
    .then(() => {

      const _sql =
        'DELETE FROM `charts`; ' +
        'INSERT INTO `charts` (`sid`, `rating_class`, `difficultly`, `rating`) ' +
        '  SELECT `sid`, 0, `difficultly_pst`, `rating_pst` FROM `songs`; ' +
        'INSERT INTO `charts` (`sid`, `rating_class`, `difficultly`, `rating`) ' +
        '  SELECT `sid`, 1, `difficultly_prs`, `rating_prs` FROM `songs`; ' +
        'INSERT INTO `charts` (`sid`, `rating_class`, `difficultly`, `rating`) ' +
        '  SELECT `sid`, 2, `difficultly_ftr`, `rating_ftr` FROM `songs`; ' +
        'INSERT OR IGNORE INTO `charts` (`sid`, `rating_class`, `difficultly`, `rating`) ' +
        '  SELECT `sid`, 3, `difficultly_byn`, `rating_byn` FROM `songs`;';
      syslog.v(TAG, _sql);

      // execute sql
      return DATABASE_ARCSONG.exec(_sql);

    });

}
