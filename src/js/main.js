/**
 * Anthony Sessa | main
 * 
 * I generally use this implementation for all javascript development
 * It is quite a bit of overkill for this task but I thought I might show
 * you how I work on larger scale projects
 */

/*jshint asi: false, browser: true, curly: true, devel: true, eqeqeq: false, forin: false, newcap: true, noempty: true, strict: true, undef: true */
/*global jQuery: true, _: true */

(function( window, $, undefined ) {

'use strict';

var CMG = window.CMG || {};

// convienence vars

var document   = window.document;
var history    = window.history;
var location   = window.location;
var Mustache   = window.Mustache;
var Modernizr  = window.Modernizr;
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
    // TODO set article data as main object member for global use
    // TODO create  links, url_path is not what we want here
    // TODO document title

    // If youd like to remove any css3 column action
    // search _base.scss for !!css3-columns-1 and !!css3-columns-2
    // then set this flag to true
    main.forceNonCssColumns = false;
    main.$content = $('#content');
    main.dataSourceURI = '../js/uidevtest-data.js';
    // main.createStoryList();

    main.createStoryView();
  },

  createStoryList: function() {
    var view = $('#story-list').html();
    var html;
    $.getJSON(main.dataSourceURI, function(data) {
      $.each( data.objects, function( index, article )  {
        main.formatAndAddDates(article, 'pub_date');
        main.formatAndAddDates(article, 'updated');
        main.formatCategoriesArrayForView(article);
        html = Mustache.render(view, article);
        main.$content.append(html).addClass('story-list');
      });
    });
  },
  createStoryView: function() {
    var view = $('#story-view').html();
    var html;
    $.getJSON(main.dataSourceURI, function(data) {
      $.each( data.objects, function( index, article )  {
        if (index == 1) {
          main.formatAndAddDates(article, 'pub_date');
          main.formatAndAddDates(article, 'updated');
          main.formatAuthorsArrayForView(article);
          main.checkCSSColumnSupport(article)
          html = Mustache.render(view, article);
          $('#content').append(html).addClass('story-view');;
        }
      });
    });
  },
  iterateDataFeed: function() {
    $.getJSON(main.dataSourceURI, function(data) {
      $.each( data.objects, function( index, article )  {

      });
    });
  },
  formatAndAddDates: function(articleObject, key) {
    var memberNameToAdd = 'formatted_' + key;
    articleObject[memberNameToAdd] = moment(articleObject[key]).format('h:mm a dddd, MMM. MM, YYYY');
  },
  // Restructuring the categories into another member of the data will allow
  // the use of inverted sections via mustache.js.
  // Given the dataset, mustache.js cannot utilize an inverted
  // section without a flag paramter
  formatCategoriesArrayForView: function(articleObject) {
    articleObject.categories_array = []
    for ( var i = 0; i < articleObject.categories_name.length; i++ ) {
      var isLast = true;
      if ( articleObject.categories_name.length - 1 != i ) {
        isLast = false;
      }
      articleObject.categories_array.push( {name: articleObject.categories_name[i], last: isLast} );
    }
  },
  // Even though there is only 1 author per article, it is being served as
  // an array - therefore conversion into flagged object for inverted selections
  formatAuthorsArrayForView: function(articleObject) {
    articleObject.authors_array = []
    for ( var i = 0; i < articleObject.author.length; i++ ) {
      var isLast = true;
      if ( articleObject.author.length - 1 != i ) {
        isLast = false;
      }
      articleObject.authors_array.push( {name: articleObject.author[i], last: isLast} );
    }
    console.log(articleObject);
  },
  // From what I am aware of there is no way to achieve css columns in 
  // browsers that dod not support the css3 columns spec
  
  // This method users bare bones custom Modernizr css3 columns polyfill
  
  // This is by no means ideal since we are solely relying on the
  // formatting of the content, most likely from a wysiwyg dashboard editor
  checkCSSColumnSupport: function(articleObject) {
    if ( !Modernizr.csscolumns || main.forceNonCssColumns ) {
      // Need root element to traverse
      var $paragraphs = $('<div>' + articleObject.story + '</div>').find('p');
      var firstColumn = [];
      var secondColumn = [];
      for ( var i = 0; i < $paragraphs.length; i++ ) {
        // Have we hit half way?
        if (i / $paragraphs.length  <= .5 ) {
          firstColumn.push($paragraphs[i]);
        } else {
          secondColumn.push($paragraphs[i]);
        }
      }
      // Need a root element again, then remove
      articleObject.story = $('<div>').append($(firstColumn).clone()).html() + '</div><div class="column">' + $('<div>').append($(secondColumn).clone()).html();
    }
  }
};

// get it goin
$document.ready( main.init );

// publicize CMG
window.CMG = CMG;

})( window, jQuery );