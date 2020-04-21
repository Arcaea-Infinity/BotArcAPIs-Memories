// filename : utils.js
// author   : TheSnowfield
// date     : 02/09/2020
// comment  : some utility functions here

module.exports = class {

  // calc song rating
  static arcCalcSongRating(score, ptt) {
    if (score >= 10000000)
      return ptt + 2;
    else if (score >= 9950000)
      return ptt + 1.5 + (score - 9950000) / 100000;
    else if (score >= 9800000)
      return ptt + 1 + (score - 9800000) / 400000;
    let _value = ptt + (score - 9500000) / 300000;
    return _value < 0 ? 0 : _value;
  }

  // map song difficulty to specific format
  static arcMapDiffFormat(input, format) {
    const _table_format = [
      '0', '1', '2',
      'pst', 'prs', 'ftr',
      'PST', 'PRS', 'FTR',
      'past', 'present', 'future',
      'PAST', 'PRESENT', 'FUTURE'
    ];

    if (input.toLowerCase)
      input = input.toLowerCase();

    // try parse input as an integer
    let _to_format = null;
    _table_format.every((element, index) => {
      if (input != element)
        return true;

      _to_format = _table_format[format * 3 + index % 3];
      return false;
    });

    if (!_to_format) return false;
    return _to_format;
  }
}
