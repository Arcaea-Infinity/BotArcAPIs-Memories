import syslog from '@syslog';
import arcfetch, { ArcFetchRequest } from './arcfetch';

const TAG: string = 'arcapi.aggregate.ts';
export default (account: IArcAccount, endpoints: Array<string>) => {
  
  return new Promise((resolve, reject) => {

    // the maximum endpoints is 5
    // account will be BANNED from server if exceed
    if (endpoints.length > 5)
      return reject(new Error('Endpoints limit exceeded'));

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
    arcfetch(_remote_request)
      .then((root: any) => {

        // teardown the object and pack data into array
        const _data: Array<any> = [];
        root.value.forEach((element: any) => {
          _data[element.id] = element.value[0];
        })

        resolve(_data);
      })
      .catch((e: string) => {

        // if token is invalid
        // just erase the token and wait for
        // auto login in next time allocating
        if (e == 'UnauthorizedError') {
          account.token = '';
          syslog.w(TAG, `Invalid token => ${account.name} ${account.token}`);
        }

        reject(e);

      });

  });

}
