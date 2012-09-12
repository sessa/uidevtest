/**
 * Anthony Sessa | main
 * 
 * I generally use this implementation for all javascript development
 * It is quite a bit of overkill for this task.
 */

/*jshint asi: false, browser: true, curly: true, devel: true, eqeqeq: false, forin: false, newcap: true, noempty: true, strict: true, undef: true */
/*global jQuery: true */

(function( window, $, undefined ) {

'use strict';

var CMG = window.CMG || {};

// convienence vars
var document  = window.document;
var history   = window.history;
var location  = window.location;
// var Modernizr = window.Modernizr;
var $window   = $(window);
var $document = $(document);


/** 
 * Slightly modified module pattern
 * 
 * Intantiating both globally available object and locally 
 * available object which creates an easily 
 * accessible "main" object that bypasses the confusion of utilizing
 * the "this" object in complex event scopes
 */
var main = CMG.main = {

  // initialization
  init: function() {

  }
};

// get it goin
$document.ready( main.init );

// publicize CMG
window.CMG = CMG;

})( window, jQuery );