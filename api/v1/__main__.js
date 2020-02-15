// filename : /v1/__main__.js
// author   : CirnoBakaBOT
// date     : 02/10/2020
// comment  : main file used to export base class

import __test__ from './test';
import __rank__ from './rank';
import __best30__ from './best30';
import __userinfo__ from './userinfo';
import __checkupdate__ from './checkupdate';
import __debug_clear_friends__ from './_debug_clear_friends';
import __debug_clear_all_friends__ from './_debug_clear_all_friends';

export default function BotArcAPI() {

  // normal api methods
  this.test = __test__;
  this.rank = __rank__;
  this.best30 = __best30__;
  this.userinfo = __userinfo__;
  this.checkupdate = __checkupdate__;

  // debug methods
  this._debug_clear_friends = __debug_clear_friends__;
  this._debug_clear_all_friends = __debug_clear_all_friends__;
};
