{buttons} = require './buttons.coffee'
{icons}   = require './icons.coffee'

header    = require '../src/templates/header.jade'


class Vanity


  constructor: ->
    @$body = $ document.body
    @addCss()
    @moveGoToBar()
    @insertNewLogo()
    @insertCommitteeName()
    @restyleLogin()
    @restylePinPage()
    @insertProfilePic()
    @insertNewTabs()
    @moveOldTabs()
    @updateFooter()
    @swapIcons()


  addCss: ->
    style      = document.createElement 'link'
    style.rel  = 'stylesheet'
    style.type = 'text/css'
    style.href = chrome.extension.getURL 'css/vanui.css'

    (document.head or document.documentElement).appendChild style
    @$body.css 'display', 'block'


  # Move the "Go To" bar up so it can stretch entire page
  moveGoToBar: ->
    $(".masterbanner").insertBefore "#ctl00_MasterPageMainTable"


  # Insert a custom logo image
  insertNewLogo: ->
    logoURL = chrome.extension.getURL 'images/whiteCircles.svg'
    $("<img id='ngpvan-logo-image' src='" + logoURL + "' />").insertBefore "#header-van-goto"


  # Pull the committe name from HTML title and insert by logo image
  insertCommitteeName: ->
    pageTitle = $(document).find("title").text()
    pageTitle = pageTitle.substring(0, pageTitle.indexOf("-") - 1)
    $("<h1 id='ngpvan-logo-name'>" + pageTitle + "</h1>").insertAfter "#ngpvan-logo-image"

  # Custom styling for Login page
  restyleLogin: ->
    if ( document.location.href.indexOf('Login') > -1 )
      $(".masterbanner").remove()
      $('body').removeClass('Grey-body classicColor').addClass 'justin-login-page'
      $('<div class="login-logo-big"><img src="' + logoURL + '" /></div>').insertBefore '#TableContentSetup'
      $('<div class="login-form"></div>').insertBefore '#TableContentSetup' 
      $('#TableContentSetup').appendTo '.login-form'
      $('#ctl00_ContentPlaceHolderVANPage_TableCellLoginContentBkgdSpaceLeft').remove()
      $('#ctl00_ContentPlaceHolderVANPage_TableCellLoginContentBkgdSpaceRight').remove()


  # Custom styling for login-like PIN page
  restylePinPage: ->
    if ( document.location.href.indexOf('PIN') > -1 )
      $('.login-form').css 'width', '970px'

  
  # Insert a sample user profile image to show logged-in user, for now a picture of me :)
  insertProfilePic: ->
    userphotoURL = chrome.extension.getURL 'images/justin.jpg'
    $("<img id='ngpvan-user-image' src='" + userphotoURL + "' />").insertAfter '#context-header-div ul li:last-child'


  # Insert div for new tabs UI at top of page
  insertNewTabs: ->
    $("<div id='ngpvan-tabs-bar'></div>").insertBefore '.masterbanner'


  # Move existing tabs into new tabs div for new styling
  moveOldTabs: ->
    $("#header ul").appendTo '#ngpvan-tabs-bar'


  # More googley footer text and get rid of the old starting date!
  updateFooter: ->
    $('.footer').html '<span id="ctl00_LabelCopyright">&copy; 2014 NGP VAN, Inc - <a href="http://www.ngpvan.com/content/privacy-policy" target="_blank">Privacy Policy</a></span>'


  swapIcons: ->
    @swapIcon icon for icon in icons
    @swapButton button for button in buttons


  swapButton: (icon) ->
    if $(icon.id).length
      document.getElementById(icon.id).src = chrome.extension.getURL(icon.icon)


  swapIcon: (icon) ->
    $(icon.id).html '<img src="' + chrome.extension.getURL(icon.icon) + '" />'


  removeMenuTableBorder: ->
    $('.MenuTableNoBorder').css 'border-top', '0'



vanity = new Vanity


# globalHeader  = document.createElement 'div'
# globalHeader.setAttribute 'id', 'global-header'
# $('body').prepend $ globalHeader

# $('#global-header').html header({})





