import arcapi_userme from './arcapi.userme';
import arcapi_friend_delete from './arcapi.friend.delete';

export default async (account: IArcAccount,
  friends?: Array<IArcPlayer>): Promise<void> => {

  let _friends: Array<IArcPlayer> = [];

  // we must request the origin arcapi
  // if no friend list passed in
  if (!friends) _friends = (await arcapi_userme(account)).friends;

  // clear friend list
  for (const v of _friends) {
    await arcapi_friend_delete(account, v.user_id);
  }

}
