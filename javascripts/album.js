// Album utilities.
//
// -----
// 
// Copyright 2013 Sequence Mediaworks
// http://www.seqmedia.com
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//   http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var SEQ;
SEQ = $.extend({
  BODY_SCROLLED_DISTANCE: 20,
  HEADER_HEIGHT: 400
}, SEQ);

$(function(){
  function watchScrolling () {
    var $win = $(window),
        $top_nav = $(".top-nav");
    $win.on("scroll", function () {
      $top_nav.toggleClass("body-scrolled", $win.scrollTop() > SEQ.BODY_SCROLLED_DISTANCE);
      $top_nav.toggleClass("body-beyond-header", $win.scrollTop() > SEQ.HEADER_HEIGHT);
    });
  }

  function watchTappingZoom () {
    $(".full-screen-control").on("click", function () {
      $('body').toggleClass('force-full-screen');
      $(window).trigger('resize');
    });
  }

  watchScrolling();
  watchTappingZoom();
});
