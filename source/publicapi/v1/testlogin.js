// filename : publicapi/testlogin.js
// author   : TheSnowfield
// date     : 04/13/2020
// comment  : test api

const TAG = 'v1/test.js';

module.exports = async (argument) => {
  // initialize response data
  const _response_template = {
    'status': null,
    'message': null,
    'content': {
      'args': null,
      'hi': null,
      'i_am_a_teapot': null
    }
  };

  //
  //const _return =  await arcapi_login('AliceCao', '12345678', '395f817c834a2d3f');

  // const arcapi_delete = require('../../arcapi/_arcapi_friend_delete');
  // const _return = await arcapi_delete({ token: '1234' }, 1);

  // const arcapi_add = require('../../arcapi/_arcapi_friend_add');
  // const _return = await arcapi_add({ token: '1234' }, 1);

  // const arcapi_rankfriend = require('../../arcapi/_arcapi_rank_friend');
  // const _return = await arcapi_rankfriend({ token: '1234' }, 'gl', 2);

  const arcapi_login = require('../../arcapi/_arcapi_login');
  const arcapi_account_alloc = require('../../arcapi/_arcapi_account_alloc');
  const arcapi_account_release = require('../../arcapi/_arcapi_account_release');

  await arcapi_account_alloc()
    .then((account) => {
      arcapi_login(account.name, account.pwd, account.deviceid)
        .then((token) => {
          syslog.d(token);
          arcapi_account_release(account);
        });
    })
    .catch((e) => { syslog.e('Alloc account failed') });

  // fill the template
  _response_template.status = 418;
  _response_template.content.hi = '(｡･∀･)ﾉﾞ嗨' + TAG;
  _response_template.content.i_am_a_teapot = 'I\'m a teapot';
  _response_template.content.args = argument;

  return _response_template;
};
