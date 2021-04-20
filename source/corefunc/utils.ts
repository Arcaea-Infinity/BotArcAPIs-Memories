class Utils {

  // calc song rating for arcaea
  static arcCalcSongRating(score: number, ptt: number): number {

    if (score >= 10_000_000)
      return ptt + 2;

    else if (score > 9_800_000)
      return ptt + 1 + (score - 9_800_000) / 200_000;

    let _value = ptt + (score - 9_500_000) / 300_000;
    return _value < 0 ? 0 : _value;

  }

  // map song difficulty to specific format
  static arcMapDiffFormat(input: string | number, format: number): string | null {

    const _table_format: Array<string> = [
      '0', '1', '2', '3',
      'pst', 'prs', 'ftr', 'byn',
      'PST', 'PRS', 'FTR', 'BYN',
      'past', 'present', 'future', 'beyond',
      'PAST', 'PRESENT', 'FUTURE', 'BEYOND'
    ];

    if (typeof input == 'string') {
      input = input.toLowerCase();
      // byd to byn
      if (input == 'byd') input = 'byn';
    }

    // try parse input as an integer
    let _to_format: string | null = null;
    _table_format.every((element: string, index: number) => {
      if (input != element)
        return true;

      _to_format = _table_format[format * 4 + index % 4];
      return false;
    });

    if (!_to_format) return '';

    return _to_format;

  }

  // instead of Object.fromEntries
  static httpGetAllParams(searchParams: URLSearchParams): any {
    if (!(searchParams instanceof URLSearchParams))
      return null;

    const _return: any = {};

    searchParams.forEach((v, k) => { _return[k] = v; });

    return _return;
  }

  // match client user agent
  static httpMatchUserAgent(ua: string): boolean {

    if (typeof BOTARCAPI_WHITELIST != 'object') return true;
    if (!BOTARCAPI_WHITELIST.length) return true;

    for (const v of BOTARCAPI_WHITELIST) {
      if (v.test(ua)) return true;
    }

    return false;
  }

  // check illegal bind variables
  static checkBindStatement(bind: any): boolean {
    const beCheck: any = Object.values(bind);

    for (let i = 0; i < beCheck.length; ++i) {
      if (beCheck[i].match(/;|\(|\)|var|let|const|delete|undefined|null|=>|\(\)|{|}|{}|=|#|==|&|\||\^|!|\*|\/|-|\+|>|<|\?/g))
        return false;
    }

    return true;
  }

}

export default Utils;
