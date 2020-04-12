// filename : arcapi/_arcapi_friend_delete.js
// author   : CirnoBakaBOT
// date     : 04/12/2020
// comment  : delete friend

const TAG = 'arcapi/_arcapi_friend_delete.js';

const arcfetch = require('../corefunc/arcfetch');
const ArcAPIRequest = arcfetch.ArcAPIRequest;

module.exports = async function (arc_account, user_id) {
  const _return_template = {
    success: false,
    friend_list: null
  };

  try {

    // construct remote request
    const _remote_request =
      new ArcAPIRequest('POST', `friend/me/delete`, {
        usertoken: arc_account.token,
        postdata: new URLSearchParams({ 'friend_id': user_id })
      });

    // send request
    await arcfetch(_remote_request)
      .then((root) => {
        _return_template.success = true;
        _return_template.friend_list = root.value.friends;
      })
      .catch((e) => { throw e; })

  } catch (e) { syslog.e(TAG, e); }

  return _return_template;
}