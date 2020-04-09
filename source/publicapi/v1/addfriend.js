// filename : /source/publicapi/addfriend.js
// author   : CirnoBakaBOT
// date     : 04/09/2020
// comment  : test api

module.exports = async function (argument) {
  // initialize response data
  const _response_template = {
    'status': null,
    'content': {
      'args': null
    }
  };

  // fill the template
  _response_template.status = 418;
  _response_template.content.hi = '(｡･∀･)ﾉﾞ嗨';

  return _response_template;
};
