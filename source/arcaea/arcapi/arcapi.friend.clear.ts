import arcapi_userme from './arcapi.userme';
import arcapi_friend_delete from './arcapi.friend.delete';

export default
  async (account: IArcAccount, friends: Array<any>):Promise<void> => {

    // fetch friend list
    const do_fetch_friend = async (x: any) => {
      // we must request the origin arcapi
      // if no friend list passed in
      if (!x.length)
        await arcapi_userme(account)
          .then((root: any) => { x = root.friends; })
      return x;
    }

    // clear friend list
    const do_clear_friend = async (friends: any, index: number = 0) => {
      if (index > friends.length - 1)
        return;
      await arcapi_friend_delete(account, friends[index].user_id)
      await do_clear_friend(friends, index + 1);
    }

    // execute promise chain
    return Promise.resolve(friends)
      .then((friends) => do_fetch_friend(friends))
      .then((friends) => do_clear_friend(friends))
      .catch((error) => { Promise.reject(error); });
  }
