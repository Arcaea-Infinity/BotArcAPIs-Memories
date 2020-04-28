// filename : arcmana/account_fromtoken.js
// author   : TheSnowfield
// date     : 04/28/2020
// common   : get account by persistent token

const TAG = 'arcmana/account_fromtoken.js';

module.exports = (token) => {
  return new Promise(async (resolve, reject) => {

    // validate data
    if (!ARCPERSISTENT[token])
      return reject(new Error('Invalid token'));

    resolve(ARCPERSISTENT[token]);

  });
}
