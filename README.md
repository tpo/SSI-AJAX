This is SSI-AJAX
----------------

"SSH-AJAX" implements an "include" mechanism for HTML.

By writing:

	<ssi-ajax>include virtual="included.html"</ssi-ajax>

that snippet of code will get replaced by the contents
of the "include.html" file.

## Contents:

* [Why would SSI-AJAX be useful?]:https://github.com/tpo/SSI-AJAX#why-would-ssi-ajax-be-useful
* [What would the characteristics of an optimal include mechanisms be?]:https://github.com/tpo/SSI-AJAX#what-would-the-characteristics-of-an-optimal-include-mechanisms-be
* [Shortcomings of existing "include" mechanisms]:https://github.com/tpo/SSI-AJAX#shortcomings-of-existing-include-mechanisms
* [Why doesn't HTML have a "include" mechanism]:https://github.com/tpo/SSI-AJAX#why-doesnt-html-have-a-include-mechanism
* [How does SSI-AJAX help?]:https://github.com/tpo/SSI-AJAX#how-does-ssi-ajax-help
* [Shortcomings of SSI-AJAX]:https://github.com/tpo/SSI-AJAX#shortcomings-of-ssi-ajax
* [Usage]:https://github.com/tpo/SSI-AJAX#shortcomings-of-ssi-ajax
* [Acknowledgements]:https://github.com/tpo/SSI-AJAX#acknowledgements
* [References]:https://github.com/tpo/SSI-AJAX#references

## Why would SSI-AJAX be useful?

When you have a web site, that contains the same page header
or footer on each web page, or the same navigation bar, then
SSI-AJAX let's you include that ever same content of every
page with a simple statement.

## What would the characteristics of an optimal include mechanisms be?

One essential goal of an "include" mechanism for the web is
economic resource usage:

* simplicity:
  * the machanism shouldn't require much brain power to
    reason about
  * the mechanism shouldn't require the programmer to
    repeat himself or do needless ceremony
  * tmplementation on web-server and web-client side
    should be easy, simple and require little resources
  
* no duplicate data transmission: if the client already
  has the data, then the same data should not be
  retransmitted over the network again. That saves:
  
  * computing power on the web-server
  * bandwidth on the network
  * computung power on the web-client/browser
  * human time waiting for the data to appear
  
* no gratuitous computation on the web-server or the
  web-client:
  
  * if it can be done on the client, then it should
    be done there to keep the network/servers lean
  * no computation should be required if not necessary

## Shortcomings of existing "include" mechanisms

How do existing mechanisms fall short of the above stated criteriums?

Today "includes" are either done:

* via web frameworks on the server side, which means:
  * web-server compute resources are used to process the same
    data over and over again
  * bandwidth is wasted to transport the same data again and again
  * humans are needlessly waiting for the same data to arive
  
* via JavaScript AJAX calls. This is quite nice except that
  * JavaScript needs to be enabled on the client side
  * compute power in JavaScript is needlessly consumed to
    piece together web pages that are possibly completely static
  
* via HTML (i)frames. Usage of HTML frames is however very
  problematic, stemming from the HTML frames' abstraction,
  that every frame is practically it's own independent
  browser or DOM tree or web page. Which means that among
  other problems of frames:
  * it's impossible to include just the data that one wants
    to repeat on every page, but instead a whole HTML document
    needs to be included in a frame

## Why doesn't HTML have a "include" mechanism

That is quite a
[myster]:https://github.com/whatwg/html/issues/331#issuecomment-242938547

## How does SSI-AJAX help?

Since there is no "include" mechanism in HTML SSI-Java can:
* do the including server-side, when JavaScript is off on the client-side
* use AJAX on the client-side if JavaScript is available

On the server side Apache's SSI
[mod_include]:https://httpd.apache.org/docs/current/mod/mod_include.html
is used.

On the client side custom JavaScript is used.

Irrespective of whether the including is done on the client
or the server the inclusion syntax is always the same.

## Shortcomings of SSI-AJAX

Currently the decision whether the including will be done
on the server or the client side is done based on the URL:

* if the URL contains `/shtml/` in its path, then the including
  is done on the server side.
* otherwise the page content is delivered to the browser
  unprocessed and the including is expected to be done by
  JavaScript in the browser.

The unsolved problem with this aproach is, that if the user
puts accesses a URL without `/shtml/` in it but does **not**
have JavaScript enabled, then the `<ssi-ajax>` tags
will not get replaced and thus the user will not see a
correctly rendered page.

What is missing is a way to detect from the server side, whether
the client has JavaScript enabled.

This could be achieved in part via UserAgent detection on the
server side, since JavaScript can **not** be disabled on
smartphone browsers. However that leaves the desktop browser
case unresolved.

## Usage

### Inside your HTML

	<ssi-ajax>include virtual="included.html"</ssi-ajax>

`included.html` is a URL. See
[here]:https://httpd.apache.org/docs/current/mod/mod_include.html#includevirtual

### Apache-side configuration

[00-ssi-ajax.conf]:00-ssi-ajax.conf defines the "include" mechanism

[ssi-ajax-demo.conf]:ssi-ajax-demo.conf specifies which directory
contains the HTML files that get their includes replaced on the server-side.

Both config files should be added and enabled in
`/etc/apache2/conf-available` or similar. Make sure that
`00-ssi-ajax.conf` is read first by Apache, since it is required by
`ssi-ajax-demo.conf`.

### HTML repository server-side

With the above Apache configuration only files in directory
`/shtml/` get processed server-side.

To have a directory with HTML files that get processed by the
browser's JavaScript it's easiest to create a symlink like this:
   
	ln -s shtml html
   
Now, when accessing the HTML files via the `/html/` URL, those
files will be only processed by JavaScript

## Acknowledgements

The syntax of the inclusion mechanism ("ssi-ajax" tag) was inspired by
[Péter Vértényi's post]:https://stackoverflow.com/a/46928819

## References

* [Apache mod_include documentation]:https://httpd.apache.org/docs/current/mod/mod_include.html
* [Péter Vértényi's post]
* a few discussions on StackOverflow about a HTML "include" mechanisms:
  * [1]:https://stackoverflow.com/questions/3928331/equivalent-of-include-in-html
  * [2]:https://stackoverflow.com/questions/8988855/include-another-html-file-in-a-html-file
  * [3]:https://softwareengineering.stackexchange.com/questions/7245/why-no-client-side-html-include-tag#7256
  * [4]:https://stackoverflow.com/questions/7542872/how-to-include-one-html-file-into-another
  * [5]:https://github.com/whatwg/html/issues/331
* [a critique of existing "include" mechanisms]:http://tpo.sourcepole.ch/articles/168%20html-http-considered-harmful.html
