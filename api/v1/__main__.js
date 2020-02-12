// filename : /v1/__main__.js
// author   : CirnoBakaBOT
// date     : 02/10/2020
// comment  : main file used to export base class

import __test__ from "./test.js";
import __rank__ from "./rank.js";
import __best30__ from "./best30.js";
import __userinfo__ from "./userinfo.js";
import __userecent__ from "./userecent.js";
import __checkupdate__ from "./checkupdate.js";

export default function BotArcAPI() {
    this.test = __test__;
    this.rank = __rank__;
    this.best30 = __best30__;
    this.userinfo = __userinfo__;
    this.userecent = __userecent__;
    this.checkupdate = __checkupdate__;
};
