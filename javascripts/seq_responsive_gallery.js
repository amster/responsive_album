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
SEQ = SEQ || {};

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
// opts: Options you can override.
SEQ.ResponsiveGallery = function ($container, entries, opts) {
  var $win = $(window);
  opts = $.extend({
        image_prefix: 'images/',
        preview_image_prefix: 'images/article/preview/',

        spinner_image: 'spinner.gif',
        spinner_text: 'Loading ...',

        preview_image_substring: 'preview/',
        large_image_substring:'large/',

        preview_image_extension: '.gif',
        large_image_extension: '.jpg',

        section_regex: /^\#\# /,
        subhead_regex: /^== /,
        text_blob_regex: / /,
        quote_regex: /^"" /,
        
        textblob_classname: 'article-text',
        quote_classname: 'article-quote',
        image_classname: 'article-image',
        image_set_classname: 'article-image-set',
        image_set_items_classname: 'article-image-set-items',
        
        image_is_preview_classname: 'preview-gallery-photo',
        image_is_loading_classname: 'loading-gallery-photo',
        image_did_load_classname: 'loaded-gallery-photo',
        loading_spinner_classname: 'loading-spinner',

        site_menu_items_classname: 'site-menu-items',
        site_menu_item_classname: 'site-menu-item',

        delay_before_loading_current_viewport: 700,
        beyond_screen_loading_range: 1200
      }, opts);

  function addEntries (items, $target) {
    $.each(items, function(idx, entry) {
      if ($.isArray(entry)) {
        var $set = $('<div class="'+opts.image_set_classname+'"><div class="'+opts.image_set_items_classname+'"></div></div>');
        addEntries(entry, $set.find("." + opts.image_set_items_classname));
        $target.append($set);
      } else if (entry.match(opts.section_regex)) {
        addSection($target, entry);
      } else if (entry.match(opts.subhead_regex)) {
        addSubhead($target, entry, 1);
      } else if (entry.match(opts.text_blob_regex)) {
        addTextblob($target, entry);  // Including quotes
      } else {
        addImage($target, entry);
      }
    });
  }

  function addImage ($container, url) {
    var $div,
        $img,
        img_url,
        external_url;

    $div = $('<div class="'+opts.image_classname+'"></div>');
    if (url.indexOf('->') >= 0) {
      external_url = url.replace(/^.*->/, '');
      url = url.replace(/->.*$/, '');
      $div.data('external-url', external_url);
    }

    img_url = opts.preview_image_prefix+url;
    $img = $('<img src="'+img_url+'">');
    if (img_url.indexOf(opts.preview_image_substring)>=0) {
      $img.addClass(opts.image_is_preview_classname);
    }
    $img.appendTo($div);
    if (external_url) {
      $('img', $div).wrap('<a href="'+external_url+'"></a>');
    }

    $container.append($div);
  }

  function addSection ($container, text) {
    var title = text.replace(opts.section_regex, ''),
        section_hash = title.toLowerCase().replace(/ /g, '-').replace(/[^a-z\-]/g, ''),
        $menu = $('.' + opts.site_menu_items_classname);
    
    $menu.append('<menuitem class="'+opts.site_menu_item_classname+'" type="command">'+
        '<a href="#'+section_hash+'">'+title+'</a>'+
        '</menuitem>');
    $container.append('<div id="'+section_hash+'"></div>');
  }

  function addSubhead ($container, text, subheading_level) {
    subheading_level++;
    $container.append(
        '<h'+subheading_level+'>' +
        text.replace(/^=+/,'').replace(/=+$/,'') +
        '</h'+subheading_level+'>');
  }

  function addTextblob ($container, text) {
    if (text.match(opts.quote_regex)) {
      text = '<quote class="'+opts.quote_classname+'">' + text.replace(opts.quote_regex, '') + '</quote>';
    }

    $container.append(
        '<p class="'+opts.textblob_classname+'">'+
        text+
        '</p>');
  }

  function loadHighResolutionPhotos () {
    var scroll_top_bound = $win.scrollTop(),
        scroll_bottom_bound = scroll_top_bound + $win.height() + opts.beyond_screen_loading_range;

    $('.'+opts.image_is_preview_classname, $container).each(function (idx, el) {
      var $img = $(el),
          img_y_top = $img.offset().top,
          imy_y_bottom = img_y_top + $img.outerHeight(),
          $spinner = $('<div class="'+opts.loading_spinner_classname+'">'+
              '<img src="'+opts.image_prefix+opts.spinner_image+'"> '+
              opts.spinner_text+
              '</div>');

      // Within visual range, load!
      if (img_y_top < scroll_bottom_bound && imy_y_bottom > scroll_top_bound) {
        $img.removeClass(opts.image_is_preview_classname).addClass(opts.image_is_loading_classname);
        $img.closest('.' + opts.image_classname).append($spinner);

        (function ($i) {
          var large_image = new Image(),
              large_image_url = $i.attr('src').
                  replace(opts.preview_image_substring, opts.large_image_substring).
                  replace(opts.preview_image_extension, opts.large_image_extension);
          large_image.onload = function () {
            $i.attr('src', large_image_url).
                removeClass(opts.image_is_loading_classname).
                addClass(opts.image_did_load_classname);
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
  window.setTimeout(loadHighResolutionPhotos, opts.delay_before_loading_current_viewport);
}
