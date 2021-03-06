{buttons}  = require './buttons.coffee'
{icons}    = require './icons.coffee'

HeaderView    = require '../src/templates/header.jade'
VANHeaderView = require '../src/templates/van-header.jade'
LANHeaderView = require '../src/templates/lan-header.jade'
VANSocialView = require '../src/templates/van-social.jade'

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

    @appendHeader()
    @appendGlobalHeader()
    # @appendVANHeader()
    @appendLANHeader()

    @appendSocial()

  addCss: ->
    @appendStyleSheet 'css/vanui.css'
    @appendStyleSheet 'css/header.css'
    @appendStyleSheet 'css/quick.css'
    @appendStyleSheet 'css/notifications.css'
    @appendStyleSheet 'css/social.css'
    @$body.css 'display', 'block'


  appendStyleSheet: (path) ->
    style      = document.createElement 'link'
    style.rel  = 'stylesheet'
    style.type = 'text/css'
    style.href = chrome.extension.getURL path
    (document.head or document.documentElement).appendChild style


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


  addIcon: (selector, path) ->
    $(selector).html '<img src="' + chrome.extension.getURL(path) + '" />'

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


  appendHeader: ->
    header = document.createElement 'div'
    header.setAttribute 'id', 'new-header'
    @$body.prepend $ header


  appendGlobalHeader: ->
    globalHeader = document.createElement 'div'
    globalHeader.setAttribute 'id', 'global-header'
    $('#new-header').append $ globalHeader
    $('#global-header').html HeaderView({})

    @addIcon '#global-header .picture', 'images/aharon.jpg'
    @addIcon '.nub', 'images/nub.svg'


  appendVANHeader: ->
    VANHeader = document.createElement 'div'
    VANHeader.setAttribute 'id', 'van-header'
    $('#new-header').append $ VANHeader
    $('#van-header').html VANHeaderView({})
    @setLinkListeners()
    @setSectionHeaderColor '#3498DB'
    @addIcon '#global-header .committee', 'images/new-votebuilder_light.svg'


  appendLANHeader: ->
    LANHeader = document.createElement 'div'
    LANHeader.setAttribute 'id', 'van-header'
    $('#new-header').append $ LANHeader
    $('#van-header').html LANHeaderView({})
    @setLinkListeners()
    @setSectionHeaderColor '#cc0000'
    @addIcon '#global-header .committee', 'images/aflcio.svg'
    @addIcon '#global-header .flag', 'images/flag.svg'


  appendSocial: ->
    HomeWrapper = document.createElement 'div'
    HomeWrapper.setAttribute 'class', 'home-wrapper'
    @$body.append $ HomeWrapper
    # $('.home-wrapper').append $('form.ng-pristine.ng-valid')

    VANSocial = document.createElement 'div'
    VANSocial.setAttribute 'id', 'van-social'
    $('.home-wrapper').append $ VANSocial
    $('#van-social').html VANSocialView({})
    $('#publisher .bar .toggle').on 'click', @togglePublisher


  toggleNotifications: ->
    $('.link.notifications').toggleClass 'active'


  togglePublisher: ->
    $('#publisher').toggleClass 'active'

    
  setLinkListeners: ->
    $('#tabs li').on 'click', @selectTab
    $('.link.notifications').on 'click', @toggleNotifications


  selectTab: (e) =>
    $tab  = $ e.currentTarget
    color = $tab.attr 'data-color'
    tabs  = $('#tabs li')
    for tab in tabs
      $(tab).removeClass('selected')
    $tab.addClass 'selected'

    @setSectionHeaderColor color


  setSectionHeaderColor: (color) ->
    $('#global-header').css 'background-color', color
    $('.van-header-backdrop').css 'background-color', color
    $('.MenuTableHeader').css 'background-color', color
    $('.MenuTableHeader').css 'color', '#ffffff'
    $('.MenuTableHeader').css 'opacity', '.7'

vanity = new Vanity










