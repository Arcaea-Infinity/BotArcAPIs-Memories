// filename : database/_dbproc_arcsong_update_from_songlist.js
// author   : TheSnowfield
// date     : 04/18/2020
// comment  : update arcsong from 'songlist' file

const TAG = 'database/_dbproc_arcsong_update_from_songlist.js';

module.exports = (songlist) => {
  return Promise.resolve()

    // do update 'songs' table
    .then(async () => {
      await new Promise((resolve, reject) => {
        if (!(songlist instanceof Object))
          return reject(new Error('wtf? invalid data: songlist is null or undefined'));
        if (!songlist.songs.length)
          return reject(new Error('wtf? invalid data: there\'s no song in the songlist'));

        songlist.songs.forEach((element, index) => {

          const _sqlbinding = {
            sid: element.id,
            name_en: element.title_localized.en,
            name_jp: !element.title_localized.ja ? '' : element.title_localized.ja,
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

          const _binding_keys = Object.keys(_sqlbinding).join();
          const _binding_vals = new Array(Object.keys(_sqlbinding).length).fill('?').join(',');
          const _binding_conflicts = (() => {
            let _array = [];
            Object.keys(_sqlbinding).forEach((v, i) => {
              if (v != 'sid')
                _array.push(`${v} = excluded.${v}`);
            });
            return _array.join(', ');
          })();

          const _sql = 'INSERT INTO ' +
            `\`songs\`(${_binding_keys}) VALUES(${_binding_vals})` +
            `ON CONFLICT(\`sid\`) DO UPDATE SET ${_binding_conflicts}`

          // execute sql
          DATABASE_ARCSONG.run(_sql, Object.values(_sqlbinding))
            .catch((e) => { syslog.e(TAG, e.stack); reject(e); })
        });

        resolve();
      });
    })

    // do update 'chart' table
    .then(async () => {
      await new Promise((resolve, reject) => {
        const _sql =
          'DELETE FROM `charts`; ' +
          'INSERT INTO `charts` (`sid`, `rating_class`, `difficultly`, `rating`) ' +
          '  SELECT `sid`, 0, `difficultly_pst`, `rating_pst` FROM `songs`;' +
          'INSERT INTO `charts` (`sid`, `rating_class`, `difficultly`, `rating`) ' +
          '  SELECT `sid`, 1, `difficultly_prs`, `rating_prs` FROM `songs`;' +
          'INSERT INTO `charts` (`sid`, `rating_class`, `difficultly`, `rating`) ' +
          '  SELECT `sid`, 2, `difficultly_ftr`, `rating_ftr` FROM `songs`;';
        syslog.v(TAG, _sql);

        // execute sql
        DATABASE_ARCSONG.exec(_sql)
          .then(() => { resolve(); })
          .catch((e) => { syslog.e(TAG, e.stack); reject(e); })
      });
    });
}