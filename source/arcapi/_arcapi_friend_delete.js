// filename : /v1/_arcapi_friend_delete.js
// author   : CirnoBakaBOT
// date     : 02/13/2020
// comment  : delete friend

export default async function (arc_account, user_id) {

  const _return_template = {
    success: false,
    arc_friendlist: null
  };

  // request origin arcapi
  const _remote_request =
    new Request(`https://arcapi.lowiro.com/${BOTARCAPI_ARCAPI_VERSION}/friend/me/delete`, {
      method: 'POST',
      headers: {
        'Accept-Encoding': 'identity',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        'Platform': 'android',
        'Authorization': `Bearer ${arc_account.token}`,
        'AppVersion': BOTARCAPI_ARCAPI_APPVERSION,
        'User-Agent': BOTARCAPI_ARCAPI_USERAGENT,
        'Host': 'arcapi.lowiro.com',
        'Connection': 'Keep-Alive'
      },
      body: new URLSearchParams({
        'friend_id': user_id
      }).toString()
    });
  const _remote_response_data = await fetch(_remote_request);

  // check for origin arcapi data
  try {
    const _json_root = await _remote_response_data.json();
    console.log('friend delete', _json_root);

    if (_json_root.success) {
      _return_template.success = true;
      _return_template.arc_friendlist = _json_root.value.friends;
    }
  } catch (e) { console.log(TAG, e); }

  return _return_template;
}