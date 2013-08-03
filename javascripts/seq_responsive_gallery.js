// Creates a photo gallery that goes from a 1- and 2- column layout on large
// screens to a single column on smaller screens. Provides simple formatting
// to create a table of contents entries, headings, text blobs, and linkable
// images.
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
  IMAGES_URL_PREFIX: 'images/',

  SPINNER_IMAGE: 'spinner.gif',
  SPINNER_TEXT: 'Loading ...',

  PREVIEW_IMAGE_SUBSTRING: 'preview/',
  LARGE_IMAGE_SUBSTRING:'large/',

  PREVIEW_IMAGE_EXTENSION: '.gif',
  LARGE_IMAGE_EXTENSION: '.jpg',

  SECTION_REGEX: /^\#\# /,
  SUBHEAD_REGEX: /^== /,
  TEXT_BLOB_REGEX: / /,
  QUOTE_REGEX: /^"" /,

  DELAY_BEFORE_LOADING_CURRENT_VIEWPORT: 700
}, SEQ);

// entries: An array whose elements are one of these types:
//
//   * 'Some text here':
//     Makes a text blob as long as you have 1 space.
//
//   * 'preview/MY_IMAGE.gif':
//     Puts up a preview image to be replaced by a full-size image named like
//     'large/MY_IMAGE.jpg'. This is best for landscape-oriented photos.
//
//   * 'preview/MY_IMAGE.gif->http://some.other.url.com':
//     Makes the image clickable and goes to a link.
//
//   * ['preview/IMAGE1.gif', 'preview/IMAGE2.gif', 'preview/IMAGE3.gif']:
//     Forces a 2-column layout, best for portrait-oriented photos.
//
//   * '## Some Part of the Story':
//     Adds a table-of-contents entry.
//
//   * '== Big Subtitle Here':
//     Adds a subtitle to the text. (This doesn't add a table-of-contents
//     entry.)
//
//   * '"" Make this a big quote':
//     Shortcut to making a <quote>quoted comment</quote.
//
SEQ.ResponsiveGallery = function ($container, entries) {
  var $section_index,
      $win = $(window),
      last_entry_type = null;

  function addEntries (items, $target, force_portrait) {
    $.each(items, function(idx, entry) {
      if ($.isArray(entry)) {
        addEntries(entry, $target, true);
      } else if (entry.match(SEQ.SECTION_REGEX)) {
        addPhotoBreak($target);
        addSection($target, entry);
      } else if (entry.match(SEQ.SUBHEAD_REGEX)) {
        addPhotoBreak($target);
        addSubhead($target, entry, 1);
      } else if (entry.match(SEQ.TEXT_BLOB_REGEX)) {
        addPhotoBreak($target);
        addTextblob($target, entry);  // Including quotes
      } else {
        addPhoto($target, entry, force_portrait);
      }
    });
  }

  function addPhoto ($container, url, force_portrait) {
    var $div,
        $img,
        external_url;

    $div = $('<div class="gallery-photo"></div>');
    if (url.indexOf('->') >= 0) {
      external_url = url.replace(/^.*->/, '');
      url = url.replace(/->.*$/, '');
      $div.data('external-url', external_url);
    }

    $img = $('<img src="'+SEQ.IMAGES_URL_PREFIX+url+'">');
    if (force_portrait) {
      $div.addClass('portrait-photo');
      last_entry_type = 'photo-portrait';
    } else {
      $div.addClass('landscape-photo');
      last_entry_type = 'photo-landscape';
    }
    if (url.indexOf(SEQ.PREVIEW_IMAGE_SUBSTRING)>=0) {
      $img.addClass('preview-gallery-photo');
    }
    $img.appendTo($div);
    if (external_url) {
      $('img', $div).wrap('<a href="'+external_url+'"></a>');
    }

    $container.append($div);
  }

  function addPhotoBreak($container) {
    if (last_entry_type === 'photo-portrait') {
      $container.append('<div class="clear"></div>');
    }
  }

  function addSection ($container, text) {
    var title = text.replace(SEQ.SECTION_REGEX, ''),
        section_hash = title.toLowerCase().replace(/ /g, '-').replace(/[^a-z\-]/g, '');
        
    if (!$section_index) {
      $section_index = $('<div class="gallery-section-index">'+
          '<div class="gallery-responsive-tab icon-reorder"></div>'+
          '</div>');
      $('body').append($section_index);

      $section_index.on("click", function(ev) {
        ev.stopImmediatePropagation();
        $section_index.toggleClass("hovered");
      }).on("mouseenter", function() {
        $section_index.addClass("hovered");
      }).on("mouseleave", function() {
        $section_index.removeClass("hovered");
      });
    }

    $section_index.append('<div class="gallery-item">'+
        '<a href="#'+section_hash+'">'+title+'</a>'+
        '</div>');
    $container.append('<div id="'+section_hash+'"></div>');

    last_entry_type = 'section';
  }

  function addSubhead ($container, text, subheading_level) {
    subheading_level++;
    $container.append(
        '<h'+subheading_level+'>' +
        text.replace(/^=+/,'').replace(/=+$/,'') +
        '</h'+subheading_level+'>');

    last_entry_type = 'subhead';
  }

  function addTextblob ($container, text) {
    if (text.match(SEQ.QUOTE_REGEX)) {
      text = '<quote>' + text.replace(SEQ.QUOTE_REGEX, '') + '</quote>';
    }

    $container.append(
        '<div class="text-blob">'+
        text+
        '</div>');

    last_entry_type = 'text-blob';
  }

  function loadHighResolutionPhotos () {
    var BEYOND_SCREEN_LOADING_RANGE = 1200,
        scroll_top_bound = $win.scrollTop(),
        scroll_bottom_bound = scroll_top_bound + $win.height() + BEYOND_SCREEN_LOADING_RANGE;

    $('.preview-gallery-photo', $container).each(function (idx, el) {
      var $img = $(el),
          img_y_top = $img.offset().top,
          imy_y_bottom = img_y_top + $img.outerHeight(),
          $spinner = $('<div class="loading-spinner">'+
              '<img src="'+SEQ.IMAGES_URL_PREFIX+'/'+SEQ.SPINNER_IMAGE+'"> '+
              SEQ.SPINNER_TEXT+
              '</div>');

      // Within visual range, load!
      if (img_y_top < scroll_bottom_bound && imy_y_bottom > scroll_top_bound) {
        $img.removeClass('preview-gallery-photo').addClass('loading-gallery-photo');
        $img.after($spinner);

        (function ($i) {
          var large_image = new Image(),
              large_image_url = $i.attr('src').
                  replace(SEQ.PREVIEW_IMAGE_SUBSTRING, SEQ.LARGE_IMAGE_SUBSTRING).
                  replace(SEQ.PREVIEW_IMAGE_EXTENSION, SEQ.LARGE_IMAGE_EXTENSION);
          large_image.onload = function () {
            $i.attr('src', large_image_url).
                removeClass('loading-gallery-photo').
                addClass('large_image-gallery-photo');
            $spinner.remove();
          }
          large_image.src = large_image_url;
        })($img);
      }
    });
  }

  addEntries(entries, $container);

  $win.on("scroll", loadHighResolutionPhotos)
      .on("resize", loadHighResolutionPhotos);
  window.setTimeout(loadHighResolutionPhotos, SEQ.DELAY_BEFORE_LOADING_CURRENT_VIEWPORT);
}
