/**
 * Anthony Sessa | main
 * 
 * I generally use this implementation for all javascript development
 * It is quite a bit of overkill for this task but I thought I might show
 * you how I work on larger scale projects
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
    main.$content = $('#content');
    main.dataSourceURI = '../js/uidevtest-data.js';
    // main.createStoryList();

    main.createStoryView();

  },

  createStoryList: function() {
    var view = $('#story-list').html();
    var html;
    console.log(main.dataSourceURI);
    $.getJSON(main.dataSourceURI, function(data) {
      $.each( data.objects, function( index, article )  {
        main.formatAndAddDates(article, 'pub_date');
        main.formatAndAddDates(article, 'updated');
        html = underscore.template(view, article);
        main.$content.append(html);
      });
    });
  },
  createStoryView: function() {
    var view = $('#story-view').html();
    var html;
    $.getJSON(main.dataSourceURI, function(data) {
      $.each( data.objects, function( index, article )  {
        if (index == 0) {
          main.formatAndAddDates(article, 'pub_date');
          main.formatAndAddDates(article, 'updated');
          html = underscore.template(view, article);
          $('#content').append(html);
        }
      });
    });
  }, 
  formatAndAddDates: function(articleObject, key) {
    var memberNameToAdd = 'formatted_' + key;
    articleObject[memberNameToAdd] = moment(articleObject[key]).format('h:mm a dddd, MMM. MM, YYYY');
  }
};

// get it goin
$document.ready( main.init );

// publicize CMG
window.CMG = CMG;

})( window, jQuery, _ );