// filename : arcapi/aggregate.js
// author   : TheSnowfield
// date     : 04/24/2020

const TAG = 'arcapi/aggregate.js';

const arcfetch = require('../corefunc/arcfetch');
const ArcAPIRequest = arcfetch.ArcAPIRequest;

module.exports = (account, endpoints) => {
  return new Promise((resolve, reject) => {

    // the maximum endpoints is 5
    // account will be BANNED from server if exceed
    if (endpoints.length > 5)
      return reject(new Error('Endpoints limit exceeded'));

    // construct endpoint object
    const _endpoints = [];
    endpoints.forEach((element, index) => {
      _endpoints.push({ endpoint: element, id: index });
    });

    // construct remote request
    const _remote_request =
      new ArcAPIRequest('GET', 'compose/aggregate?' +
        new URLSearchParams({ 'calls': JSON.stringify(_endpoints) }), {
        deviceid: account.device,
        usertoken: account.token
      });

    // send request
    arcfetch(_remote_request)
      .then((root) => {

        // teardown the object and pack data into array
        const _data = [];
        root.value.forEach((element) => {
          _data[element.id] = element.value[0];
        })

        resolve(_data);
      })
      .catch((e) => {

        // if token is invalid
        // just erase the token and wait for
        // auto login in next time allocating
        if (e == 'UnauthorizedError') {
          account.token = '';
          syslog.w(TAG, `Invalid token => ${account.name} ${account.token}`);
        }

        reject(e);
      })
  });
}
