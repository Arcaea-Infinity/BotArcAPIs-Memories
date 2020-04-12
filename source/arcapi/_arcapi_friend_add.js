// filename : /source/arcapi/_arcapi_friend_add.js
// author   : CirnoBakaBOT
// date     : 04/10/2020
// commont  : add friend

const TAG = 'arcapi/_arcapi_friend_add.js';

const arcfetch = require('../corefunc/arcfetch');
const ArcAPIRequest = arcfetch.ArcAPIRequest;

module.exports = async function (arc_account, user_code) {
  const _return_template = {
    success: false,
    friend_list: null
  };

  try {

    // construct remote request
    const _remote_request =
      new ArcAPIRequest('POST', `friend/me/add`, {
        usertoken: arc_account.token,
        postdata: new URLSearchParams({ 'friend_code': user_code })
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