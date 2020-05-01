export default (songlist: IArcSongListFile): Promise<void> => {
  return Promise.resolve()

    // do update 'songs' table
    .then(() => {

      songlist.songs.forEach((element) => {

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
          world_unlock: element.world_unlock == true ? 'true' : 'false',
          remote_download: element.remote_dl == true ? 'true' : 'false',
          difficultly_pst: element.difficulties[0].rating,
          difficultly_prs: element.difficulties[1].rating,
          difficultly_ftr: element.difficulties[2].rating,
          chart_designer_pst: element.difficulties[0].chartDesigner,
          chart_designer_prs: element.difficulties[1].chartDesigner,
          chart_designer_ftr: element.difficulties[2].chartDesigner,
          jacket_designer_pst: element.difficulties[0].jacketDesigner,
          jacket_designer_prs: element.difficulties[1].jacketDesigner,
          jacket_designer_ftr: element.difficulties[2].jacketDesigner,
        };

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

        // execute sql
        return DATABASE_ARCSONG.run(_sql, Object.values(_sqlbinding))

      });

    })

    // do update 'chart' table
    .then(() => {
      const _sql =
        'DELETE FROM `charts`; ' +
        'INSERT INTO `charts` (`sid`, `rating_class`, `difficultly`, `rating`) ' +
        '  SELECT `sid`, 0, `difficultly_pst`, `rating_pst` FROM `songs`;' +
        'INSERT INTO `charts` (`sid`, `rating_class`, `difficultly`, `rating`) ' +
        '  SELECT `sid`, 1, `difficultly_prs`, `rating_prs` FROM `songs`;' +
        'INSERT INTO `charts` (`sid`, `rating_class`, `difficultly`, `rating`) ' +
        '  SELECT `sid`, 2, `difficultly_ftr`, `rating_ftr` FROM `songs`;';

      // execute sql
      return DATABASE_ARCSONG.exec(_sql);
    });

}
