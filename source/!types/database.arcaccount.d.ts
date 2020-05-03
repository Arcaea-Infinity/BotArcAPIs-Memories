declare interface IDatabaseArcAccount {
  uid: number,
  ucode: string,
  token: string,
  banned: 'true' | 'false',
  name: string,
  passwd: string,
  device: string,
}