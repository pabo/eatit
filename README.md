brett.schellenberg@gmail.com

Welcome to Eat it!
==================
This is a proof-of-concept project with some tongue-in-cheek styling (Eat it, Weird Al), developed as a code sample. It consists of a simple php json service and an HTML/javascript/jQuery front-end. To get started, open up index.html and begin typing a query into the search box. As you type, it will fetch results from the json service, and create the autocompleter you can interact with. Use either the mouse or the arrow up/down and enter keys to choose a selection.

YELP! BIG CAVEAT!
-----------------
For now, we do a hacky thing: request more data from yelp. Ideally a real implementation would have a db.csv that already contains all the info we need. I just wanted a little more info to display in this project.  Since we are doing yelp API requests for every json request, our UI is not very responsive. I suggest you demo this project both WITH and WITHOUT yelp enabled. WITH to see what it could look like if we had access to more data on the backend, and WITHOUT to see how responsive our interface actually is. This setting can be controlled in cgi/q.php.


Files
=====
File                      | Description
--------------------------|-------------------------|
README                    | You're reading it now...

index.html                | Eat it! homepage
style.css                 | styles
db.csv                    | csv file of restaurants, referenced by cgi/q.php

scripts/eatit.js          | script for Eat it! project, which refers to these libraries:
scripts/ajaxget.js        | fetch results and insert them into the HTML page, for simple display or to hook up an autocompleter to.
scripts/autocomplete.js   | auto completer. user interacts with it with various key/mouse events. other events are passed through.
scripts/elementCycle.js   | just a little fun: I use it here to cycle through random appropriate lyrics from the Weird Al song "Eat it".

cgi/q.php                 | json service which responds to a query with a list of results
cgi/yelp.php              | access to yelp API
cgi/OAuth.php             | OAuth support, needed for yelp API


Testing Notes
=============
-Mac OSX 10.9.4
    -Firefox 31.0
    -Safari 7.0.5
        -Safari supports bfcache so when we come back to the page after navigating away, state is maintained
    -Chrome 37.0.2062.94

-iPhone 4 / iOS 7
    -Safari
        -The input box is a little crowded with the name and cuisine and yelp ratings.


Specification
=============
project guidelines: (from http://www.gofundme.com/code-sample)

Using the information above code us a page that:
-Has a place for a user to type
-As the user is typing, a list of restaurant names should be shown to them. The results should include any restaurant whose name starts with the letters the user has typed so far AND any restaurant whose cuisine starts with the letters typed so far.
-This page needs to be fast, look good and function properly.
-This needs to be coded in PHP and jQuery


Copyright
=========
Note that I do not hold any rights to any images used in this project. As a proof-of-concept, no copyright infringement is intended.
I also do not own cgi/yelp.php or cgi/OAuth.php. These were provided by the yelp API examples. Each of those files lists its source within.


All other files are subject to the MIT License:

Copyright (c) 2014 Brett Schellenberg <brett.schellenberg@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
