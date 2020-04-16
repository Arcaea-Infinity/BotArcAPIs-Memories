// filename : utils.js
// author   : CirnoBakaBOT
// date     : 02/09/2020
// comment  : some utility functions here

module.exports = class {

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
