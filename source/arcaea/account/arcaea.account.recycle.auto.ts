import arcaea_account_recycle from './arcaea.account.recycle';

export default (token: string): Promise<void> => {
  return new Promise(async (resolve, reject) => {

    // validate data
    if (!ARCPERSISTENT[token])
      return reject(new Error('Invalid token'));

    // recycle the account
    await arcaea_account_recycle(ARCPERSISTENT[token]);
    delete ARCPERSISTENT[token];

    resolve();
  });
}
