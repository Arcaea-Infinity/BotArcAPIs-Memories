export default (token: string): Promise<ArcAccount> => {
  return new Promise(async (resolve, reject) => {

    // validate data
    if (!ARCPERSISTENT[token])
      return reject(new Error('Invalid token'));

    resolve(ARCPERSISTENT[token]);

  });
}
