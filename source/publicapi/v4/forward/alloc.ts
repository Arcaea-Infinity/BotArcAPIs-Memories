const TAG: string = 'v4/forward/alloc.ts\t';

import syslog from '../../../modules/syslog/syslog';
import APIError from '../../../modules/apierror/apierror';
import account_alloc_managed from '../../../modules/account/alloc.managed';

export default (argument: any): Promise<any> => {

  return new Promise(async (resolve, reject) => {

    try {

      // /forward/alloc[?time=xxx][&clear=true]
      // validate the request arguments
      argument.time = parseInt(argument.time);
      argument.clear = argument.clear == 'true' ? true : false;

      // check time
      if (isNaN(argument.time) || argument.time == 0)
        argument.time = BOTARCAPI_FORWARD_TIMESEC_DEFAULT;

      // clamp the range
      if (argument.time < BOTARCAPI_FORWARD_TIMESEC_DEFAULT
        || argument.time > BOTARCAPI_FORWARD_TIMESEC_MAX)
        throw new APIError(-1, 'invalid time');

      let _token = null;
      try { _token = await account_alloc_managed(argument.time, argument.clear); }
      catch (e) { throw new APIError(-2, 'allocate an arc account failed'); }

      const _return = {
        access_token: _token,
        valid_time: argument.time
      };

      resolve(_return);

    } catch (e) {

      if (e instanceof APIError)
        return reject(e);

      syslog.e(TAG, e.stack);
      return reject(new APIError(-233, 'unknown error occurred'));

    }

  });

}
