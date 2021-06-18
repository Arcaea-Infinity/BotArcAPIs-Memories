"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Utils {
    static arcCalcSongRating(score, ptt) {
        if (score >= 10000000)
            return ptt + 2;
        else if (score > 9800000)
            return ptt + 1 + (score - 9800000) / 200000;
        let _value = ptt + (score - 9500000) / 300000;
        return _value < 0 ? 0 : _value;
    }
    static arcMapDiffFormat(input, format) {
        const _table_format = [
            '0', '1', '2', '3',
            'pst', 'prs', 'ftr', 'byn',
            'PST', 'PRS', 'FTR', 'BYN',
            'past', 'present', 'future', 'beyond',
            'PAST', 'PRESENT', 'FUTURE', 'BEYOND'
        ];
        if (typeof input == 'string') {
            input = input.toLowerCase();
            if (input == 'byd')
                input = 'byn';
        }
        let _to_format = null;
        _table_format.every((element, index) => {
            if (input != element)
                return true;
            _to_format = _table_format[format * 4 + index % 4];
            return false;
        });
        if (!_to_format)
            return '';
        return _to_format;
    }
    static httpGetAllParams(searchParams) {
        if (!(searchParams instanceof URLSearchParams))
            return null;
        const _return = {};
        searchParams.forEach((v, k) => { _return[k] = v; });
        return _return;
    }
    static httpMatchUserAgent(ua) {
        if (typeof BOTARCAPI_WHITELIST != 'object')
            return true;
        if (!BOTARCAPI_WHITELIST.length)
            return true;
        for (const v of BOTARCAPI_WHITELIST) {
            if (v.test(ua))
                return true;
        }
        return false;
    }
    static checkBindStatement(bind) {
        const beCheck = Object.values(bind);
        for (let i = 0; i < beCheck.length; ++i) {
            if (beCheck[i].match(/;|\(|\)|var|let|const|delete|undefined|null|=>|\(\)|{|}|{}|=|#|==|&|\||\^|!|\*|\/|-|\+|>|<|\?/g))
                return false;
        }
        return true;
    }
}
exports.default = Utils;
//# sourceMappingURL=utils.js.map