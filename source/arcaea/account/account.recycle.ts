export default (account: IArcAccount) => {
  return new Promise((resolve, reject) => {
    ARCACCOUNT.push(account);
    resolve();
  });
}
