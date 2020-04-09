// filename : /source/arcapi/_arcapi_rank_friend.js
// author   : CirnoBakaBOT
// date     : 04/09/2020

module.exports = async function (arc_account, song_id, difficulty, start = 0, limit = 10) {
  const TAG = '_arcapi_rank_friend.js';
  const _return_template = {
    success: false,
    arc_ranklist: null
  };

  // request origin arcapi
  const fetch = require('node-fetch');
  const _remote_request =
    new fetch.Request(`https://arcapi.lowiro.com/${ARCAPI_VERSION}/score/song/friend?` +
      new URLSearchParams({
        'song_id': song_id,
        'difficulty': difficulty,
        'start': start,
        'limit': limit
      }), {
      method: 'GET',
      headers: {
        'Accept-Encoding': 'identity',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        'Platform': 'android',
        'Authorization': `Bearer ${arc_account.token}`,
        'AppVersion': ARCAPI_APPVERSION,
        'User-Agent': ARCAPI_USERAGENT,
        'Host': 'arcapi.lowiro.com',
        'Connection': 'Keep-Alive'
      }
    });
  const _remote_response_data = await fetch(_remote_request);

  // check for origin arcapi data
  try {
    const _json_root = await _remote_response_data.json();
    console.log(TAG, _json_root);

    if (_json_root.success) {
      _return_template.success = true;
      _return_template.arc_ranklist = _json_root.value;
    }
  } catch (e) { console.log(TAG, e); }

  return _return_template;
}