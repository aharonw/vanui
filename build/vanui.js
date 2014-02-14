// Generated by CoffeeScript 1.7.1
(function() {
  var logoURL, pageTitle, style, template, userphotoURL;

  template = require('./templates/header.jade');

  style = document.createElement('link');

  style.rel = 'stylesheet';

  style.type = 'text/css';

  style.href = chrome.extension.getURL('css/vanui.css');

  (document.head || document.documentElement).appendChild(style);

  $(document.body).css('display', 'block');

  $(".masterbanner").insertBefore("#ctl00_MasterPageMainTable");

  logoURL = chrome.extension.getURL('images/whiteCircles.svg');

  $("<img id='ngpvan-logo-image' src='" + logoURL + "' />").insertBefore("#header-van-goto");

  pageTitle = $(document).find("title").text();

  pageTitle = pageTitle.substring(0, pageTitle.indexOf("-") - 1);

  $("<h1 id='ngpvan-logo-name'>" + pageTitle + "</h1>").insertAfter("#ngpvan-logo-image");

  if (document.location.href.indexOf('Login') > -1) {
    $(".masterbanner").remove();
    $('body').removeClass('Grey-body classicColor').addClass('justin-login-page');
    $('<div class="login-logo-big"><img src="' + logoURL + '" /></div>').insertBefore('#TableContentSetup');
    $('<div class="login-form"></div>').insertBefore('#TableContentSetup');
    $('#TableContentSetup').appendTo('.login-form');
    $('#ctl00_ContentPlaceHolderVANPage_TableCellLoginContentBkgdSpaceLeft').remove();
    $('#ctl00_ContentPlaceHolderVANPage_TableCellLoginContentBkgdSpaceRight').remove();
  }

  if (document.location.href.indexOf('PIN') > -1) {
    $('.login-form').css('width', '970px');
  }

  userphotoURL = chrome.extension.getURL('images/justin.jpg');

  $("<img id='ngpvan-user-image' src='" + userphotoURL + "' />").insertAfter('#context-header-div ul li:last-child');

  $("<div id='ngpvan-tabs-bar'></div>").insertBefore('.masterbanner');

  $("#header ul").appendTo('#ngpvan-tabs-bar');

  $('.footer').html('<span id="ctl00_LabelCopyright">&copy; 2014 NGP VAN, Inc - <a href="http://www.ngpvan.com/content/privacy-policy" target="_blank">Privacy Policy</a></span>');

  $('.MenuTableNoBorder').css('border-top', '0');

}).call(this);