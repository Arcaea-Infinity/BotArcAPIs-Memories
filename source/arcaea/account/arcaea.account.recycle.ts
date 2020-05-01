export default (account: ArcAccount) => {
  return new Promise((resolve, reject) => {
    ARCACCOUNT.push(account);
    resolve();
  });
}
