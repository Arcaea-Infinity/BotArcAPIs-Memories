// filename : /v1/userbest30.js
// author   : TheSnowfield
// date     : 02/10/2020
// comment  : api for user best30

import Utils from 'Utils';
import ArcApiAggregate from './_arcapi_aggregate';
import DataArcSongTable from './__static_data_song_table.json';

export default async function () {

  const TAG = 'userbest30.js';

  // initialize response data
  let _return = null;
  let _response_status = 200;
  const _response_data_template = {
    'best_top30_avg': null,
    'recent_top10_avg': null,
    'best30_list': null
  };

  // default song data table
  // must keep it's latest when Arcaea upgrade every time
  let _arc_song_table = DataArcSongTable;

  ////// step 1.
  // pre-fill the chart heap for query
  let _arc_charts_heap = [];
  for (let i = 0; i < 30; ++i) {
    _arc_charts_heap.push(_arc_song_table.shift());
  }

  ////// step 2.
  // query 5 charts in one batch with 6 times
  for (let i = 0; i < 6; ++i) {

    // fill endpoints
    let _arc_batch_endpoints = [];
    for (let j = 0; j < 5; j++) {
      let _index = i * 5 + j;
      _arc_batch_endpoints.push('/score/song/friend?' +
        new URLSearchParams({
          'song_id': _arc_charts_heap[_index].song_id,
          'difficulty': _arc_charts_heapp[_index].difficulty,
          'start': 0,
          'limit': 1
        }));
    }

    // request origin arcapi
    const _return = await ArcApiAggregate(_arc_account, _arc_batch_endpoints);
    if (!_return.success)
      return Utils.MakeApiObject(502);
    const _arc_batch_ranklists = _return.data;

    // fill user rating and score
    for (let j = 0; j < 5; j++) {
      let _index = i * 5 + j;

      // validate results
      if (_arc_batch_ranklists[j].song_id != _arc_charts_heap[_index].song_id ||
        _arc_batch_ranklists[j].difficulty != _arc_charts_heap[_index].difficulty)
        return Utils.MakeApiObject(502);

      // calc song rating
      let _arc_chart_rating = Utils.ArcCalcSongRating(
        parseInt(_arc_batch_ranklists[j].score),
        _arc_charts_heap[_index].ptt / 10
      );

      // save user info in queue
      _arc_charts_heap[_index].user_rank = _arc_batch_ranklists[j];
      _arc_charts_heap[_index].user_song_rating = _arc_chart_rating;
    }
  }

  ////// step 3.
  // sort chart heap by user rating
  _arc_charts_heap.sort((a, b) => {
    return a.user_song_rating - b.user_song_rating;
  });

  ////// step 4.
  // query remain charts until less than user ptt


  ////// step 5.
  // sort chart heap again
  _arc_charts_heap.sort((a, b) => {
    return a.user_song_rating - b.user_song_rating;
  });

  ////// step 6.
  // clean the empty charts from heap


  ////// step 7.
  // calc best30 average and recent 10 average
  const _arc_best30_sum = _arc_charts_heap.reduce((total, element) => {
    return total + element;
  });
  const _arc_best30_avg = _arc_best30_sum / 30;
  let _arc_recent10_avg = _arc_account.rating / 100 * 4 - _arc_best30_avg * 3;
  _arc_recent10_avg = _arc_recent10_avg < 0 ? 0 : _arc_recent10_avg;

  // fill the data template
  _response_data_template.best_top30_avg = _arc_best30_avg;
  _response_data_template.recent_top10_avg = _arc_recent10_avg;
  _response_data_template.best30_list = _arc_charts_heap;

  // return data
  return Utils.MakeApiObject(_response_status, _response_data_template);
};

