//We have to use JS to apply our custom CSS since there are a lot other CSS files
var style = document.createElement('link');
style.rel = 'stylesheet';
style.type = 'text/css';
style.href = chrome.extension.getURL('css/vanui.css');
(document.head||document.documentElement).appendChild(style);

//Move the "Go To" bar up so it can stretch entire page
$(".masterbanner").insertBefore("#ctl00_MasterPageMainTable");

//Insert a custom logo image
var logoURL = chrome.extension.getURL('images/whiteCircles.svg');
$("<img id='ngpvan-logo-image' src='" + logoURL + "' />").insertBefore("#header-van-goto");

//Pull the committe name from HTML title and insert by logo image
var pageTitle = $(document).find("title").text();
pageTitle = pageTitle.substring(0, pageTitle.indexOf("-") - 1);
$("<h1 id='ngpvan-logo-name'>" + pageTitle + "</h1>").insertAfter("#ngpvan-logo-image");

//Custom styling for Login page
if ( document.location.href.indexOf('Login') > -1 ) {
    $(".masterbanner").remove();
    $('body').removeClass('Grey-body classicColor').addClass('justin-login-page');
    $('<div class="login-logo-big"><img src="' + logoURL + '" /></div>').insertBefore('#TableContentSetup');
    $('<div class="login-form"></div>').insertBefore('#TableContentSetup');
    $('#TableContentSetup').appendTo('.login-form');
    $('#ctl00_ContentPlaceHolderVANPage_TableCellLoginContentBkgdSpaceLeft').remove();
    $('#ctl00_ContentPlaceHolderVANPage_TableCellLoginContentBkgdSpaceRight').remove();
}

//Custom styling for login-like PIN page
if ( document.location.href.indexOf('PIN') > -1 ) {
    $('.login-form').css('width', '970px');
}

//Insert a sample user profile image to show logged-in user, for now a picture of me :)
var userphotoURL = chrome.extension.getURL('images/justin.jpg');
$("<img id='ngpvan-user-image' src='" + userphotoURL + "' />").insertAfter("#context-header-div ul li:last-child");

//Insert div for new tabs UI at top of page
$("<div id='ngpvan-tabs-bar'></div>").insertBefore(".masterbanner");

//Move existing tabs into new tabs div for new styling
$("#header ul").appendTo("#ngpvan-tabs-bar");

//More googley footer text and get rid of the old starting date!
$('.footer').html('<span id="ctl00_LabelCopyright">&copy; 2014 NGP VAN, Inc - <a href="http://www.ngpvan.com/content/privacy-policy" target="_blank">Privacy Policy</a></span>');

//Everything else below is just updating icons...fun times!
//Default.aspx icons
$('#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconQuickLookUp').html('<img src="' + chrome.extension.getURL('images/glyphicons_027_search.png') + '" />');
$('#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconCreateANewList').html('<img src="' + chrome.extension.getURL('images/glyphicons_149_folder_new.png') + '" />');
$('#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconViewCurrentList').html('<img src="' + chrome.extension.getURL('images/glyphicons_147_folder_lock.png') + '" />');
$('#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconSavedLists').html('<img src="' + chrome.extension.getURL('images/glyphicons_144_folder_open.png') + '" />');
$('#ctl00_ContentPlaceHolderVANPage_accordionMenuGOTV_header_HyperLinkImageIconGOTV').html('<img src="' + chrome.extension.getURL('images/glyphicons_355_bullhorn.png') + '" />');
$('#ctl00_ContentPlaceHolderVANPage_AccordionCanvassResultsAccordionPane_header_HyperLinkImageIconCanvassResults').html('<img src="' + chrome.extension.getURL('images/glyphicons_079_signal.png') + '" />');
$('#ctl00_ContentPlaceHolderVANPage_CountsAndCrosstabsAccordionPane_header_HyperLinkImageIconCountsAndCrosstabs').html('<img src="' + chrome.extension.getURL('images/glyphicons_042_pie_chart.png') + '" />');
$('#ctl00_ContentPlaceHolderVANPage_AccordionPaneNationalDataMenu_header_HyperLinkImageIconNationalData').html('<img src="' + chrome.extension.getURL('images/glyphicons_040_stats.png') + '" />');
$('#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconNationalDashboard').html('<img src="' + chrome.extension.getURL('images/glyphicons_331_dashboard.png') + '" />');
$('#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconQuickMark').html('<img src="' + chrome.extension.getURL('images/glyphicons_039_notes.png') + '" />');
$('#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconBarCodes').html('<img src="' + chrome.extension.getURL('images/glyphicons_259_barcode.png') + '" />');
$('#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconScriptView').html('<img src="' + chrome.extension.getURL('images/glyphicons_114_list.png') + '" />');
$('#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconGridView').html('<img src="' + chrome.extension.getURL('images/glyphicons_156_show_thumbnails.png') + '" />');
$('#ctl00_ContentPlaceHolderVANPage_AccordianPaneDataEntry_header_HyperLinkImageIconFormView').html('<img src="' + chrome.extension.getURL('images/glyphicons_319_sort.png') + '" />');
$('#ctl00_ContentPlaceHolderVANPage_AccordianPaneUploadNewFile_header_HyperLinkImageIconBulkUpload').html('<img src="' + chrome.extension.getURL('images/glyphicons_059_cargo.png') + '" />');
$('#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconMiniVAN').html('<img src="' + chrome.extension.getURL('images/glyphicons_163_iphone.png') + '" />');
$('#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconNeighborToNeighbor').html('<img src="' + chrome.extension.getURL('images/glyphicons_024_parents.png') + '" />');
$('#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconVirtualPhoneBank0').html('<img src="' + chrome.extension.getURL('images/glyphicons_441_phone_alt.png') + '" />');

//ContactDetails.aspx & ContactDetailScript.aspx icons
if ($('#ctl00_ContentPlaceHolderVANPage_ctl13_ImageButtonSaveAllEID4105EACActions').length){
    document.getElementById("ctl00_ContentPlaceHolderVANPage_ctl13_ImageButtonSaveAllEID4105EACActions").src = chrome.extension.getURL('images/glyphicons_414_disk_save.png');
}

if ($('#ctl00_ContentPlaceHolderVANPage_ctl13_ImageButtonSavePageLayoutEID4105EACActions').length){
    document.getElementById("ctl00_ContentPlaceHolderVANPage_ctl13_ImageButtonSavePageLayoutEID4105EACActions").src = chrome.extension.getURL('images/glyphicons_406_sort-by-order.png');
}

if ($('#ctl00_ContentPlaceHolderVANPage_ctl04_StandardViewButton').length){
    document.getElementById("ctl00_ContentPlaceHolderVANPage_ctl04_StandardViewButton").src = chrome.extension.getURL('images/glyphicons_039_notes.png');
}

if ($('#ctl00_ContentPlaceHolderVANPage_ControlPanel_StandardViewButton').length){
    document.getElementById("ctl00_ContentPlaceHolderVANPage_ControlPanel_StandardViewButton").src = chrome.extension.getURL('images/glyphicons_039_notes.png');
}

if ($('#ctl00_ContentPlaceHolderVANPage_ctl04_ScriptViewButton').length){
    document.getElementById("ctl00_ContentPlaceHolderVANPage_ctl04_ScriptViewButton").src = chrome.extension.getURL('images/glyphicons_114_list.png');
}

if ($('#ctl00_ContentPlaceHolderVANPage_ControlPanel_ScriptViewButton').length){
    document.getElementById("ctl00_ContentPlaceHolderVANPage_ControlPanel_ScriptViewButton").src = chrome.extension.getURL('images/glyphicons_114_list.png');
}

if ($('#ctl00_ContentPlaceHolderVANPage_ctl04_FormViewButton').length){
    document.getElementById("ctl00_ContentPlaceHolderVANPage_ctl04_FormViewButton").src = chrome.extension.getURL('images/glyphicons_319_sort.png');
}

if ($('#ctl00_ContentPlaceHolderVANPage_ControlPanel_SettingsButton').length){
    document.getElementById("ctl00_ContentPlaceHolderVANPage_ControlPanel_SettingsButton").src = chrome.extension.getURL('images/glyphicons_280_settings.png');
}

if ($('#ctl00_ContentPlaceHolderVANPage_ctl04_PrintViewButton').length){
    document.getElementById("ctl00_ContentPlaceHolderVANPage_ctl04_PrintViewButton").src = chrome.extension.getURL('images/glyphicons_015_print.png');
}

if ($('#ctl00_ContentPlaceHolderVANPage_ControlPanel_PrintViewButton').length){
    document.getElementById("ctl00_ContentPlaceHolderVANPage_ControlPanel_PrintViewButton").src = chrome.extension.getURL('images/glyphicons_015_print.png');
}

$('#ctl00_ContentPlaceHolderVANPage_ctl04_ClearLink').html('<img id="ctl00_ContentPlaceHolderVANPage_ctl04_ClearButton" title="Clear" src="' + chrome.extension.getURL('images/glyphicons_207_remove_2.png') + '" />');
$('#ctl00_ContentPlaceHolderVANPage_ControlPanel_ClearLink').html('<img id="ctl00_ContentPlaceHolderVANPage_ControlPanel_ClearButton" title="Clear" src="' + chrome.extension.getURL('images/glyphicons_207_remove_2.png') + '" />');

if ($('#ctl00_ContentPlaceHolderVANPage_ctl04_SaveButton').length){
    document.getElementById("ctl00_ContentPlaceHolderVANPage_ctl04_SaveButton").src = chrome.extension.getURL('images/glyphicons_414_disk_save.png');
}

if ($('#ctl00_ContentPlaceHolderVANPage_ControlPanel_SaveButton').length){
    document.getElementById("ctl00_ContentPlaceHolderVANPage_ControlPanel_SaveButton").src = chrome.extension.getURL('images/glyphicons_414_disk_save.png');
}

//MyList.aspx icons
$('#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconAddNames').html('<img src="' + chrome.extension.getURL('images/glyphicons_432_plus.png') + '" />');
$('#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconRemoveNames').html('<img src="' + chrome.extension.getURL('images/glyphicons_433_minus.png') + '" />');
$('#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconNarrowMyList').html('<img src="' + chrome.extension.getURL('images/glyphicons_320_filter.png') + '" />');
$('#ctl00_ContentPlaceHolderVANPage_HyperLinkImagePrintReportsAndForms').html('<img src="' + chrome.extension.getURL('images/glyphicons_015_print.png') + '" />');
$('#ctl00_ContentPlaceHolderVANPage_HyperLinkImagePrintLetters').html('<img src="' + chrome.extension.getURL('images/glyphicons_010_envelope.png') + '" />');
$('#ctl00_ContentPlaceHolderVANPage_HyperLinkImagePrintLabels').html('<img src="' + chrome.extension.getURL('images/glyphicons_286_fabric.png') + '" />');
$('#ctl00_ContentPlaceHolderVANPage_HyperLinkImagePrintEmails').html('<img src="' + chrome.extension.getURL('images/glyphicons_120_message_full.png') + '" />');
$('#ctl00_ContentPlaceHolderVANPage_HyperLinkImagePhones').html('<img src="' + chrome.extension.getURL('images/glyphicons_441_phone_alt.png') + '" />');
$('#ctl00_ContentPlaceHolderVANPage_HyperLinkImageExport').html('<img src="' + chrome.extension.getURL('images/glyphicons_359_file_export.png') + '" />');
$('#ctl00_ContentPlaceHolderVANPage_HyperLinkImageMiniVAN').html('<img src="' + chrome.extension.getURL('images/glyphicons_163_iphone.png') + '" />');
$('#ctl00_ContentPlaceHolderVANPage_HyperLinkImageCounts').html('<img src="' + chrome.extension.getURL('images/glyphicons_042_pie_chart.png') + '" />');
$('#ctl00_ContentPlaceHolderVANPage_HyperLinkImageCutTurf').html('<img src="' + chrome.extension.getURL('images/glyphicons_340_globe.png') + '" />');
$('#ctl00_ContentPlaceHolderVANPage_HyperLinkImageHouseholdingWizard').html('<img src="' + chrome.extension.getURL('images/glyphicons_020_home.png') + '" />');
$('#ctl00_ContentPlaceHolderVANPage_HyperLinkImageSplitList').html('<img src="' + chrome.extension.getURL('images/glyphicons_249_divide.png') + '" />');
$('#ctl00_ContentPlaceHolderVANPage_HyperLinkImageSample').html('<img src="' + chrome.extension.getURL('images/glyphicons_322_playing_dices.png') + '" />');
$('#ctl00_ContentPlaceHolderVANPage_HyperLinkImageScoreFilter').html('<img src="' + chrome.extension.getURL('images/glyphicons_139_adjust_alt.png') + '" />');
$('#ctl00_ContentPlaceHolderVANPage_HyperLinkImageGridView').html('<img src="' + chrome.extension.getURL('images/glyphicons_156_show_thumbnails.png') + '" />');
$('#ctl00_ContentPlaceHolderVANPage_HyperLinkImageScriptView').html('<img src="' + chrome.extension.getURL('images/glyphicons_114_list.png') + '" />');
$('#ctl00_ContentPlaceHolderVANPage_HyperLinkImageFormView').html('<img src="' + chrome.extension.getURL('images/glyphicons_319_sort.png') + '" />');
$('#ctl00_ContentPlaceHolderVANPage_HyperLinkImageTasks').html('<img src="' + chrome.extension.getURL('images/glyphicons_150_edit.png') + '" />');
$('#ctl00_ContentPlaceHolderVANPage_HyperLinkImageBulkUpload').html('<img src="' + chrome.extension.getURL('images/glyphicons_363_cloud_upload.png') + '" />');
$('#ctl00_ContentPlaceHolderVANPage_HyperLinkImageCopyToMyCampaign').html('<img src="' + chrome.extension.getURL('images/glyphicons_080_retweet.png') + '" />');
$('#ctl00_ContentPlaceHolderVANPage_HyperLinkImageRelations').html('<img src="' + chrome.extension.getURL('images/glyphicons_043_group.png') + '" />');
$('td.imagepadding.van-specialdetails a').html('<img src="' + chrome.extension.getURL('images/glyphicons_406_sort-by-order.png') + '" />');
$('.MenuTableNoBorder').css('border-top','0');

//Voter Registration icons
$('#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconData Entry').html('<img src="' + chrome.extension.getURL('images/glyphicons_464_server_plus.png') + '" />');
$('#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconVoter').html('<img src="' + chrome.extension.getURL('images/glyphicons_463_server.png') + '" />');

//My Members icons
$('#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconQuickLookUpOrgs1').html('<img src="' + chrome.extension.getURL('images/glyphicons_089_building.png') + '" />');
$('#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconEventVolunteerReports').html('<img src="' + chrome.extension.getURL('images/glyphicons_352_nameplate.png') + '" />');
$('#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconEventParticipantSummary').html('<img src="' + chrome.extension.getURL('images/glyphicons_352_nameplate.png') + '" />');
$('#ctl00_ContentPlaceHolderVANPage_AccordionPaneSignaturesMenu_header_HyperLinkImageIconSignatureGathering').html('<img src="' + chrome.extension.getURL('images/glyphicons_030_pencil.png') + '" />');
$('#ctl00_ContentPlaceHolderVANPage_EventsAccordionPane_header_HyperLinkImageIconCalendarEvents').html('<img src="' + chrome.extension.getURL('images/glyphicons_045_calendar.png') + '" />');

//My Campaign icons
$('#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconQuickLookUpOrgs3565').html('<img src="' + chrome.extension.getURL('images/glyphicons_043_group.png') + '" />');
$('#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconStagingLocations').html('<img src="' + chrome.extension.getURL('images/glyphicons_238_pin.png') + '" />');
$('#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconStories').html('<img src="' + chrome.extension.getURL('images/glyphicons_071_book.png') + '" />');
$('#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconIncidents').html('<img src="' + chrome.extension.getURL('images/glyphicons_070_umbrella.png') + '" />');
$('#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconIncidentsVolunteers').html('<img src="' + chrome.extension.getURL('images/glyphicons_307_life_preserver.png') + '" />');
