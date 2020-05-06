export default interface IArcAccount {
  uid: number,
  ucode: string,
  token: string,
  banned: 'true' | 'false' | true | false,
  name: string,
  passwd: string,
  device: string
}
