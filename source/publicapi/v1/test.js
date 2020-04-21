// filename : source/publicapi/test.js
// author   : TheSnowfield
// date     : 04/09/2020
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

  //const arcapi_login = require('../../arcapi/_arcapi_login');
  //const _return =  await arcapi_login('AliceCao', '12345678', '395f817c834a2d3f');

  // const arcapi_delete = require('../../arcapi/_arcapi_friend_delete');
  // const _return = await arcapi_delete({ token: '1234' }, 1);

  // const arcapi_add = require('../../arcapi/_arcapi_friend_add');
  // const _return = await arcapi_add({ token: '1234' }, 1);

  // const arcapi_rankfriend = require('../../arcapi/_arcapi_rank_friend');
  // const _return = await arcapi_rankfriend({ token: '1234' }, 'gl', 2);

  const dbproc_arcsong_byany = require('../../database/_dbproc_arcsong_sid_byany');

  let _return = null;
  try {
    _return = await dbproc_arcsong_byany('AB');
  } catch (e) { syslog.d('fuckfuckfuckfuckfuckfuckfuck'); syslog.d(e.stack); }
  syslog.d(_return);


  // fill the template
  _response_template.status = 418;
  _response_template.content.hi = '(｡･∀･)ﾉﾞ嗨' + TAG;
  _response_template.content.i_am_a_teapot = 'I\'m a teapot';
  _response_template.content.args = argument;

  return _response_template;
};
