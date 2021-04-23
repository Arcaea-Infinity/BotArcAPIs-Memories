const TAG: string = 'account/feed.managed.ts';

import syslog from '../syslog/syslog';

export default (token: string): Promise<number> => {

  return new Promise(async (resolve, reject) => {

    // validate data
    if (!ARCPERSISTENT[token])
      return reject(new Error('Invalid token'));

    // Check feed
    if (++ARCPERSISTENT[token].feeded >= BOTARCAPI_FORWARD_FEED_MAX)
      return reject(new Error('Feed token failed'));

    // Feed for the valid time
    ++ARCPERSISTENT[token].feed;

    resolve(ARCPERSISTENT[token].feed * ARCPERSISTENT[token].validtime);

  });

}
