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

    // If youd like to remove any css3 column action
    // search _base.scss for !!css3-columns-1 and !!css3-columns-2
    // then set this flag to true
    main.forceNonCssColumns = false;
    main.$content           = $('#content');
    main.dataSourceURI      = '../js/uidevtest-data.js';

    console.log(Modernizr);
    
    // Sort of a dispatcher / controller combo
    main.dispatch();
  },
  dispatch: function() {
    if (main.getParameterByName('story').length) {
      var value        = main.getParameterByName('story');
      var validatedUrl = main.validateParameter(value);

      if(validatedUrl) {
        main.createStoryView(validatedUrl[1]);
      } else {
        window.location = 'index.html';
      }
    } else {
      main.createStoryList();
    }
  },
  createStoryList: function() {
    var view = $('#story-list').html();
    document.title = 'Story Listing';

    $.getJSON(main.dataSourceURI, function(data) {

      var html;
      $.each( data.objects, function( index, article )  {

        main.formatViewData( article, index ); 
        html = Mustache.render(view, article);
        main.$content.append(html).addClass('story-list');
      });
    });
  },
  createStoryView: function(value) {
    var storyIndex = ( parseInt(value, 10) ) - 1; // need 0 index for dataFeed Object
    var view = $('#story-view').html();
    

    $.getJSON( main.dataSourceURI, function( data ) {
      var foundStory = false;
      var html;
      $.each( data.objects, function( index, article )  {

        if ( index == storyIndex ) {
          document.title = article.title;
          main.formatViewData( article, index );
          main.addColumnSupport( article );

          html = Mustache.render(view, article);
          main.$content.append(html).addClass('story-view');
          foundStory = true;
          return;
        }
      });

      if ( !foundStory ) {
        window.location = 'index.html';
      }

    });
  },
  // Creates standardized view object
  //
  // Author and Categories are not necessary in each view
  // but the benefit of the identical object expectation
  // outweighs the cost as for now
  formatViewData: function( articleObject, index ) {
    main.formatAndAddDates( articleObject, 'pub_date' );
    main.formatAndAddDates( articleObject, 'updated' );
    main.formatCategoriesArrayForView( articleObject );
    main.formatAuthorsArrayForView( articleObject );
    main.formatUrlQuery( articleObject, index );
  },
  formatUrlQuery: function( articleObject, index ) {
    index++;
    if ( index < 10 ) {
      index = '0' + index;
    }
    articleObject.url_query = 'sto' + index;
  },
  formatAndAddDates: function( articleObject, key ) {
    var memberNameToAdd = 'formatted_' + key;
    articleObject[memberNameToAdd] = moment(articleObject[key]).format('h:mm a dddd, MMM. MM, YYYY');
  },
  // Restructuring the categories into another member of the data will allow
  // the use of inverted sections via mustache.js.
  // Given the dataset, mustache.js cannot utilize an inverted
  // section without a flag paramter
  formatCategoriesArrayForView: function( articleObject ) {
    articleObject.categories_array = [];

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
  formatAuthorsArrayForView: function( articleObject ) {
    articleObject.authors_array = [];

    for ( var i = 0; i < articleObject.author.length; i++ ) {
      var isLast = true;
      if ( articleObject.author.length - 1 != i ) {
        isLast = false;
      }
      articleObject.authors_array.push( {name: articleObject.author[i], last: isLast} );
    }
  },
  // From what I am aware of there is no way to achieve css columns in 
  // browsers that dod not support the css3 columns spec
  
  // This method users bare bones custom Modernizr css3 columns polyfill
  
  // This is by no means ideal since we are solely relying on the
  // formatting of the content, most likely from a wysiwyg dashboard editor
  addColumnSupport: function( articleObject ) {
    if ( !Modernizr.csscolumns || main.forceNonCssColumns ) {

      // Need root element to traverse
      var $paragraphs = $('<div>' + articleObject.story + '</div>').find('p');
      var firstColumn = [];
      var secondColumn = [];
      for ( var i = 0; i < $paragraphs.length; i++ ) {
        // Have we hit half way?
        if (i / $paragraphs.length  <= 0.5 ) {
          firstColumn.push($paragraphs[i]);
        } else {
          secondColumn.push($paragraphs[i]);
        }
      }
      // Need a root element again, then remove
      articleObject.story = $('<div>').append($(firstColumn).clone()).html() + '</div><div class="column">' + $('<div>').append($(secondColumn).clone()).html();
    }
  },
  // Regex here might not be the most efficient but it has quite a bit of approval
  // http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values
  // Slightly cleaned up
  getParameterByName: function( name ) {
    // cleaned up this regex a little bit
    name        = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regexS  = "[\\?&]" + name + "=([^&#]*)";
    var regex   = new RegExp(regexS);
    var results = regex.exec(window.location.search);
    if(results === null) {
      return "";
    } else {
      return decodeURIComponent(results[1].replace(/\+/g, " "));
    }
  },
  // Vailidate and group ugly integer
  validateParameter: function(value) {
    var regexS = '^sto([0-9]{1,3})';
    var regex  = new RegExp(regexS);
    return regex.exec(value);
  }
};

// get it goin
$document.ready( main.init );

// publicize CMG
window.CMG = CMG;

})( window, jQuery );