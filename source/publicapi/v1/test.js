// filename : /source/publicapi/test.js
// author   : CirnoBakaBOT
// date     : 04/09/2020
// comment  : test api

const TAG = 'v1/test.js';

module.exports = async function (argument) {
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

  // fill the template
  _response_template.status = 418;
  _response_template.content.hi = '(｡･∀･)ﾉﾞ嗨' + TAG;
  _response_template.content.i_am_a_teapot = 'I\'m a teapot';
  _response_template.content.args = argument;

  return _response_template;
};
