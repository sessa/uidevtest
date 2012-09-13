/**
 * Anthony Sessa | main
 * 
 * I generally use this implementation for all javascript development
 * It is quite a bit of overkill for this task.
 */

/*jshint asi: false, browser: true, curly: true, devel: true, eqeqeq: false, forin: false, newcap: true, noempty: true, strict: true, undef: true */
/*global jQuery: true, _: true */

(function( window, $, underscore, undefined ) {

'use strict';

var CMG = window.CMG || {};

// convienence vars

var document   = window.document;
var history    = window.history;
var location   = window.location;
var moment     = window.moment; // http://momentjs.com/
// var Mustache  = window.Mustache;
// var Underscore  = window.Underscore;
// var Modernizr = window.Modernizr;
var $window   = $(window);
var $document = $(document);


/** 
 * Slightly modified module pattern
 * 
 * Encapsulation not used in this instance
 *
 * Intantiating both globally and locally 
 * available object which creates an easily 
 * accessible "main" object that bypasses the confusion of utilizing
 * the "this" object in complex event scopes
 *
 * I find that this comes in handy when you have much much larger
 * javascript applications that utilize multiple files with
 * needs for namespacing
 */
var main = CMG.main = {

  // initialization
  init: function() {
    $.getJSON('../js/uidevtest-data.js', function(data) {
      var view = $('#story-list').html();

      $.each( data.objects, function( index, article )  {
        article.formatted_pub_date = moment(article.pub_date).format('h:mm a dddd, MMM. MM, YYYY');
        article.formatted_updated = moment(article.updated).format('h:mm a dddd, MMM. MM, YYYY');
        html = underscore.template(view, article);
        $('#content').append(html);
      });

    });
  }
};

// get it goin
$document.ready( main.init );

// publicize CMG
window.CMG = CMG;

})( window, jQuery, _ );