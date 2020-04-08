// filename : /source/publicapi/test.js
// author   : CirnoBakaBOT
// date     : 04/09/2020
// comment  : test api

module.exports = async function (argument) {
  // initialize response data
  const _response_template = {
    'status': null,
    'content': {
      'hi': null,
      'i_am_a_teapot': null
    }
  };

  // fill the template
  _response_template.status = 418;
  _response_template.content.hi = '(｡･∀･)ﾉﾞ嗨';
  _response_template.content.i_am_a_teapot = 'I\'m a teapot';

  return _response_template;
};
