// filename : /source/arcapi/_arcapi_friend_delete.js
// author   : CirnoBakaBOT
// date     : 04/09/2020
// comment  : delete friend

module.exports = async function (arc_account, user_id) {
  const TAG = '_arcapi_friend_delete.js';
  const _return_template = {
    success: false,
    arc_friendlist: null
  };

  // request origin arcapi
  const fetch = require('node-fetch');
  const _remote_request =
    new fetch.Request(`https://arcapi.lowiro.com/${ARCAPI_VERSION}/friend/me/delete`, {
      method: 'POST',
      headers: {
        'Accept-Encoding': 'identity',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        'Platform': 'android',
        'Authorization': `Bearer ${arc_account.token}`,
        'AppVersion': ARCAPI_APPVERSION,
        'User-Agent': ARCAPI_USERAGENT,
        'Host': 'arcapi.lowiro.com',
        'Connection': 'Keep-Alive'
      },
      body: new URLSearchParams({
        'friend_id': user_id
      })
    });
  const _remote_response_data = await fetch(_remote_request);

  // check for origin arcapi data
  try {
    const _json_root = await _remote_response_data.json();
    console.log(TAG, _json_root);

    if (_json_root.success) {
      _return_template.success = true;
      _return_template.arc_friendlist = _json_root.value.friends;
    }
  } catch (e) { console.log(TAG, e); }

  return _return_template;
}