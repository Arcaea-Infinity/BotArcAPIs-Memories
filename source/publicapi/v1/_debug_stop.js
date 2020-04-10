// filename : /publicapi/v1/_debug_stop.js
// author   : CirnoBakaBOT
// date     : 04/10/2020
// comment  : stop and quit

module.exports = async () => {

  // close database
  await DATABASE_ARCBEST30.close();
  await DATABASE_ARCPLAYER.close();
  await DATABASE_ARCRECORD.close();

  process.exit();
}