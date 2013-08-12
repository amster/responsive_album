responsive_album
================

A simple photo album with its own formatting options and a responsive layout.
Driven by JavaScript and Jekyll. See the example album this software generated at:

- http://www.seqmedia.com/projects/responsive_album

Installation
------------

You'll need to install Jekyll first. Please see the quick installation documentation:

- http://jekyllrb.com/docs/quickstart/

Then start up a Jekyll server for port 4000:

    jk serve -w

And point your browser to your new website!

- http://localhost:4000

Features!
---------

This album is designed to dynamically load a list of photos and text that looks amazing on both the desktop and mobile formats. You can:

* Display big, awesome photos
* Create 2-column layouts
* Create a table-of-contents
* Add text and subheadings

Customization
-------------

Open up *index.html* and see the *entries* array. Each element in the array turns into an item in the responsive gallery. If you give a photo URL it will be included---if your URL has "preview/" in it then the preview image will be loaded and later substituted with the "large/" image of almost the same name. (Preview images should be .gif, large images should be .jpg.) Images can be displayed in 2-column mode too (which is best for portrait orientation) by adding an array of URLs.

But, there's more! :)

Instead of a URL type in some text and it'll show up as a text item. Or, put a "## " at the beginning and it will make a table-of-contents link. Or start the text with "== " and it turns into a subheading.

This simple markup lets you narrate a story with your photos.

Creating Preview Images
-----------------------

Preview images are meant to be the same dimensions as their large-format counterparts but have a fraction of the file size. There is a Photoshop action in the *etc/* directory which creates a 3-color posterized version of a photo.

The best workflow is to put all of the large images into *images/large/* and then run a Photoshop batch filter and *override the Save As options* to save the processed images into *images/preview/* as GIFs. In the *index.html* file list the preview images and the responsive gallery JavaScript will load the large version of the image when the user scrolls close to that image.

About This Software
-------------------

This is an evolving piece of software created for showing photos from our wedding. Since then it has been repackaged for a friend's birthday, and now hopefully a little more refined as open source software. One day this will grow into something even more awesome.

Known issues:

* WCAG
* SEO
* loses scrolling position on mobile orientation change
* putting two text sections next to each other puts a large gap between them

License
-------

Copyright 2013 Sequence Mediaworks
http://www.seqmedia.com

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
