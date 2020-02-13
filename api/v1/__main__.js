// filename : /v1/__main__.js
// author   : CirnoBakaBOT
// date     : 02/10/2020
// comment  : main file used to export base class

import __test__ from './test';
import __rank__ from './rank';
import __best30__ from './best30';
import __userinfo__ from './userinfo';
import __userecent__ from './userecent';
import __checkupdate__ from './checkupdate';
import __debug_clearfriends from './_debug_clearfriends';

export default function BotArcAPI() {

    // noral api methods
    this.test = __test__;
    this.rank = __rank__;
    this.best30 = __best30__;
    this.userinfo = __userinfo__;
    this.userecent = __userecent__;
    this.checkupdate = __checkupdate__;

    // debug methods
    this._debug_clearfriends = __debug_clearfriends;
};
