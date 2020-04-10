// filename : utils.js
// author   : CirnoBakaBOT
// date     : 02/09/2020
// comment  : some utility functions here

module.exports = class {

  // convert http arguments string to
  // javascript object like this
  // foo=1&bar=2  =>  {foo:"1", bar:"2"}
  static UrlArgumentToObject(http_arguments) {
    let _url_params = new URLSearchParams(http_arguments);
    return Object.fromEntries(_url_params);
  }

  // request an arc account from cloudflare KV
  static async ArcRequestAccount() {
    //for debug only
    let _return_template = {
      success: true,
      arc_account: {
        token: "uF1aN6ToaYOIcSg2R+jERcQylw/9cWa19O96Ge63smg=",
        userid: "2959990",
        device_id: "49f91ac733fd12e4"
      }
    };
    return _return_template;
  }

  // B must includes A
  // find difference in A by enum array B
  // return object in B when success
  static ArcCompareFriendList(arraya, arrayb) {
    let _object = null;
    arrayb.forEach(itorb => {
      if (arraya.findIndex(itora => itora.user_id == itorb.user_id) == -1)
        _object = _object == null ? itorb : _object;
    });
    return _object;
  }

  // enum friend list
  static ArcFriendUserIdExist(array, user_id) {
    let _is_exist = false;
    array.forEach(friend => {
      if (friend.user_id == user_id)
        _is_exist = true;
    });

    return _is_exist;
  }

  // calc song rating
  static ArcCalcSongRating(score, ptt) {
    if (score >= 10000000)
      return ptt + 2;
    else if (score >= 9950000)
      return ptt + 1.5 + (score - 9950000) / 100000;
    else if (score >= 9800000)
      return ptt + 1 + (score - 9800000) / 400000;
    let _value = ptt + (score - 9500000) / 300000;
    return _value < 0 ? 0 : _value;
  }
}
