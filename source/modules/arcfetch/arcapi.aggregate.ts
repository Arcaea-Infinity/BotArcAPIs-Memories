const TAG: string = 'arcapi.aggregate.ts';

import syslog from '../syslog/syslog';
import arcfetch, { ArcFetchRequest, ArcFetchMethod } from './arcfetch';
import IArcAccount from './interfaces/IArcAccount';
import arcapi_any from './arcapi.any';

export default async (account: IArcAccount,
  endpoints: Array<string>): Promise<any> => {

  // account will be BANNED from server if exceed
  if (endpoints.length > BOTARCAPI_AGGREGATE_LIMITATION)
    throw new Error('Endpoints limit exceeded');

  if (BOTARCAPI_AGGREGATE_ENABLED) {

    // construct endpoint object
    const _endpoints: Array<any> = [];
    endpoints.forEach((element, index) => {
      _endpoints.push({ endpoint: element, id: index });
    });

    // construct remote request
    const _remote_request =
      new ArcFetchRequest(ArcFetchMethod.GET, 'compose/aggregate', {
        deviceId: account.device,
        userToken: account.token,
        submitData: new URLSearchParams({ 'calls': JSON.stringify(_endpoints) })
      });

    // send request
    return arcfetch(_remote_request)
      .then((root: any) => {

        // teardown the object and pack data into array
        const _data: Array<any> = [];
        root.value.forEach((element: any) => {
          _data[element.id] = element.value[0];
        })

        return _data;
      })
      .catch((e: string) => {

        // if token is invalid
        // just erase the token and wait for
        // auto login in next time allocating
        if (e == 'UnauthorizedError') {
          account.token = '';
          syslog.w(TAG, `Invalid token => ${account.name} ${account.token}`);
        }

        throw e;
      });

  } else {
    if (BOTARCAPI_AGGREGATE_CONCURRENT) {

      // construct tasks
      const _tasks: Array<Promise<any>> = [];
      endpoints.forEach((element, index) => {
        _tasks.push(arcapi_any(account, ArcFetchMethod.GET, element, ""));
      });

      // wait for data coming in
      return Promise.all(_tasks)
        .then(data => {
          let _results: any[] = [];
          
          data.forEach((element, index) =>
            _results.push(element.value[0]));

          return _results;

        }).catch((e: string) => {

          // if token is invalid
          // just erase the token and wait for
          // auto login in next time allocating
          if (e == 'UnauthorizedError') {
            account.token = '';
            syslog.w(TAG, `Invalid token => ${account.name} ${account.token}`);
          }
          throw e;
        });

    } else {

      let _results: any[] = [];

      try {

        // request one by one
        for (let i = 0; i < endpoints.length; ++i) {
          const _data: any = await arcapi_any(account, ArcFetchMethod.GET, endpoints[i], "");
          _results.push(_data.value[0]);
        }
        return _results;

      } catch (e) {

        // if token is invalid
        // just erase the token and wait for
        // auto login in next time allocating
        if (e == 'UnauthorizedError') {
          account.token = '';
          syslog.w(TAG, `Invalid token => ${account.name} ${account.token}`);
        }
        throw e;
      }

    }

  }

}
