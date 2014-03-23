(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.jade=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/**
 * Merge two attribute objects giving precedence
 * to values in object `b`. Classes are special-cased
 * allowing for arrays and merging/joining appropriately
 * resulting in a string.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api private
 */

exports.merge = function merge(a, b) {
  if (arguments.length === 1) {
    var attrs = a[0];
    for (var i = 1; i < a.length; i++) {
      attrs = merge(attrs, a[i]);
    }
    return attrs;
  }
  var ac = a['class'];
  var bc = b['class'];

  if (ac || bc) {
    ac = ac || [];
    bc = bc || [];
    if (!Array.isArray(ac)) ac = [ac];
    if (!Array.isArray(bc)) bc = [bc];
    a['class'] = ac.concat(bc).filter(nulls);
  }

  for (var key in b) {
    if (key != 'class') {
      a[key] = b[key];
    }
  }

  return a;
};

/**
 * Filter null `val`s.
 *
 * @param {*} val
 * @return {Boolean}
 * @api private
 */

function nulls(val) {
  return val != null && val !== '';
}

/**
 * join array as classes.
 *
 * @param {*} val
 * @return {String}
 */
exports.joinClasses = joinClasses;
function joinClasses(val) {
  return Array.isArray(val) ? val.map(joinClasses).filter(nulls).join(' ') : val;
}

/**
 * Render the given classes.
 *
 * @param {Array} classes
 * @param {Array.<Boolean>} escaped
 * @return {String}
 */
exports.cls = function cls(classes, escaped) {
  var buf = [];
  for (var i = 0; i < classes.length; i++) {
    if (escaped && escaped[i]) {
      buf.push(exports.escape(joinClasses([classes[i]])));
    } else {
      buf.push(joinClasses(classes[i]));
    }
  }
  var text = joinClasses(buf);
  if (text.length) {
    return ' class="' + text + '"';
  } else {
    return '';
  }
};

/**
 * Render the given attribute.
 *
 * @param {String} key
 * @param {String} val
 * @param {Boolean} escaped
 * @param {Boolean} terse
 * @return {String}
 */
exports.attr = function attr(key, val, escaped, terse) {
  if ('boolean' == typeof val || null == val) {
    if (val) {
      return ' ' + (terse ? key : key + '="' + key + '"');
    } else {
      return '';
    }
  } else if (0 == key.indexOf('data') && 'string' != typeof val) {
    return ' ' + key + "='" + JSON.stringify(val).replace(/'/g, '&apos;') + "'";
  } else if (escaped) {
    return ' ' + key + '="' + exports.escape(val) + '"';
  } else {
    return ' ' + key + '="' + val + '"';
  }
};

/**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @param {Object} escaped
 * @return {String}
 */
exports.attrs = function attrs(obj, terse){
  var buf = [];

  var keys = Object.keys(obj);

  if (keys.length) {
    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i]
        , val = obj[key];

      if ('class' == key) {
        if (val = joinClasses(val)) {
          buf.push(' ' + key + '="' + val + '"');
        }
      } else {
        buf.push(exports.attr(key, val, false, terse));
      }
    }
  }

  return buf.join('');
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

exports.escape = function escape(html){
  var result = String(html)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  if (result === '' + html) return html;
  else return result;
};

/**
 * Re-throw the given `err` in context to the
 * the jade in `filename` at the given `lineno`.
 *
 * @param {Error} err
 * @param {String} filename
 * @param {String} lineno
 * @api private
 */

exports.rethrow = function rethrow(err, filename, lineno, str){
  if (!(err instanceof Error)) throw err;
  if ((typeof window != 'undefined' || !filename) && !str) {
    err.message += ' on line ' + lineno;
    throw err;
  }
  try {
    str =  str || require('fs').readFileSync(filename, 'utf8')
  } catch (ex) {
    rethrow(err, null, lineno)
  }
  var context = 3
    , lines = str.split('\n')
    , start = Math.max(lineno - context, 0)
    , end = Math.min(lines.length, lineno + context);

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? '  > ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'Jade') + ':' + lineno
    + '\n' + context + '\n\n' + err.message;
  throw err;
};

},{"fs":2}],2:[function(require,module,exports){

},{}]},{},[1])
(1)
});
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"fs":9}],2:[function(require,module,exports){
var Buttons;

Buttons = [
  {
    id: 'ctl00_ContentPlaceHolderVANPage_ctl13_ImageButtonSavePageLayoutEID4105EACActions',
    icon: 'images/glyphicons_406_sort-by-order.png'
  }, {
    id: 'ctl00_ContentPlaceHolderVANPage_ctl04_StandardViewButton',
    icon: 'images/glyphicons_039_notes.png'
  }, {
    id: 'ctl00_ContentPlaceHolderVANPage_ControlPanel_StandardViewButton',
    icon: 'images/glyphicons_039_notes.png'
  }, {
    id: 'ctl00_ContentPlaceHolderVANPage_ctl04_ScriptViewButton',
    icon: 'images/glyphicons_114_list.png'
  }, {
    id: 'ctl00_ContentPlaceHolderVANPage_ControlPanel_ScriptViewButton',
    icon: 'images/glyphicons_114_list.png'
  }, {
    id: 'ctl00_ContentPlaceHolderVANPage_ctl04_FormViewButton',
    icon: 'images/glyphicons_319_sort.png'
  }, {
    id: 'ctl00_ContentPlaceHolderVANPage_ControlPanel_SettingsButton',
    icon: 'images/glyphicons_280_settings.png'
  }, {
    id: 'ctl00_ContentPlaceHolderVANPage_ctl04_PrintViewButton',
    icon: 'images/glyphicons_015_print.png'
  }, {
    id: 'ctl00_ContentPlaceHolderVANPage_ControlPanel_PrintViewButton',
    icon: 'images/glyphicons_015_print.png'
  }, {
    id: 'ctl00_ContentPlaceHolderVANPage_ctl04_SaveButton',
    icon: 'images/glyphicons_414_disk_save.png'
  }, {
    id: 'ctl00_ContentPlaceHolderVANPage_ControlPanel_SaveButton',
    icon: 'images/glyphicons_414_disk_save.png'
  }
];

exports.buttons = Buttons;


},{}],3:[function(require,module,exports){
var Icons;

Icons = [
  {
    id: '#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconQuickLookUp',
    icon: 'images/glyphicons_027_search.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconCreateANewList',
    icon: 'images/glyphicons_149_folder_new.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconViewCurrentList',
    icon: 'images/glyphicons_147_folder_lock.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconSavedLists',
    icon: 'images/glyphicons_144_folder_open.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_accordionMenuGOTV_header_HyperLinkImageIconGOTV',
    icon: 'images/glyphicons_355_bullhorn.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_AccordionCanvassResultsAccordionPane_header_HyperLinkImageIconCanvassResults',
    icon: 'images/glyphicons_079_signal.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_CountsAndCrosstabsAccordionPane_header_HyperLinkImageIconCountsAndCrosstabs',
    icon: 'images/glyphicons_042_pie_chart.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_AccordionPaneNationalDataMenu_header_HyperLinkImageIconNationalData',
    icon: 'images/glyphicons_040_stats.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconNationalDashboard',
    icon: 'images/glyphicons_331_dashboard.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconQuickMark',
    icon: 'images/glyphicons_039_notes.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconBarCodes',
    icon: 'images/glyphicons_259_barcode.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconScriptView',
    icon: 'images/glyphicons_114_list.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconGridView',
    icon: 'images/glyphicons_156_show_thumbnails.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_AccordianPaneDataEntry_header_HyperLinkImageIconFormView',
    icon: 'images/glyphicons_319_sort.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_AccordianPaneUploadNewFile_header_HyperLinkImageIconBulkUpload',
    icon: 'images/glyphicons_059_cargo.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconMiniVAN',
    icon: 'images/glyphicons_163_iphone.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconNeighborToNeighbor',
    icon: 'images/glyphicons_024_parents.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconVirtualPhoneBank0',
    icon: 'images/glyphicons_441_phone_alt.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconAddNames',
    icon: 'images/glyphicons_432_plus.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconRemoveNames',
    icon: 'images/glyphicons_433_minus.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconNarrowMyList',
    icon: 'images/glyphicons_320_filter.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_HyperLinkImagePrintReportsAndForms',
    icon: 'images/glyphicons_015_print.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_HyperLinkImagePrintLetters',
    icon: 'images/glyphicons_010_envelope.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_HyperLinkImagePrintLabels',
    icon: 'images/glyphicons_286_fabric.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_HyperLinkImagePrintEmails',
    icon: 'images/glyphicons_120_message_full.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_HyperLinkImagePhones',
    icon: 'images/glyphicons_441_phone_alt.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_HyperLinkImageExport',
    icon: 'images/glyphicons_359_file_export.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_HyperLinkImageMiniVAN',
    icon: 'images/glyphicons_163_iphone.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_HyperLinkImageCounts',
    icon: 'images/glyphicons_042_pie_chart.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_HyperLinkImageCutTurf',
    icon: 'images/glyphicons_340_globe.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_HyperLinkImageHouseholdingWizard',
    icon: 'images/glyphicons_020_home.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_HyperLinkImageSplitList',
    icon: 'images/glyphicons_249_divide.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_HyperLinkImageSample',
    icon: 'images/glyphicons_322_playing_dices.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_HyperLinkImageScoreFilter',
    icon: 'images/glyphicons_139_adjust_alt.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_HyperLinkImageGridView',
    icon: 'images/glyphicons_156_show_thumbnails.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_HyperLinkImageScriptView',
    icon: 'images/glyphicons_114_list.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_HyperLinkImageFormView',
    icon: 'images/glyphicons_319_sort.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_HyperLinkImageTasks',
    icon: 'images/glyphicons_150_edit.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_HyperLinkImageBulkUpload',
    icon: 'images/glyphicons_363_cloud_upload.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_HyperLinkImageCopyToMyCampaign',
    icon: 'images/glyphicons_080_retweet.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_HyperLinkImageRelations',
    icon: 'images/glyphicons_043_group.png'
  }, {
    id: 'td.imagepadding.van-specialdetails a',
    icon: 'images/glyphicons_406_sort-by-order.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconData Entry',
    icon: 'images/glyphicons_464_server_plus.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconVoter',
    icon: 'images/glyphicons_463_server.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconQuickLookUpOrgs1',
    icon: 'images/glyphicons_089_building.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconEventVolunteerReports',
    icon: 'images/glyphicons_352_nameplate.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconEventParticipantSummary',
    icon: 'images/glyphicons_352_nameplate.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_AccordionPaneSignaturesMenu_header_HyperLinkImageIconSignatureGathering',
    icon: 'images/glyphicons_030_pencil.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_EventsAccordionPane_header_HyperLinkImageIconCalendarEvents',
    icon: 'images/glyphicons_045_calendar.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconQuickLookUpOrgs3565',
    icon: 'images/glyphicons_043_group.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconStagingLocations',
    icon: 'images/glyphicons_238_pin.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconStories',
    icon: 'images/glyphicons_071_book.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconIncidents',
    icon: 'images/glyphicons_070_umbrella.png'
  }, {
    id: '#ctl00_ContentPlaceHolderVANPage_HyperLinkImageIconIncidentsVolunteers',
    icon: 'images/glyphicons_307_life_preserver.png'
  }
];

exports.icons = Icons;


},{}],4:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};

buf.push("<div class=\"wrapper\"><ul class=\"left\"><li class=\"committee\"></li><li class=\"flag\"></li><li class=\"title\">- New Jersey</li></ul><ul class=\"right\"><li class=\"link\">Go To</li><li class=\"link notifications\">Notifications (4)<ul id=\"notifications\"><li><div class=\"top\"><div class=\"icon\"></div><div class=\"title\">Create A List with Explorer</div><div class=\"dismiss\">Dismiss</div></div><div class=\"bottom\"><div class=\"actor\">Uretsky, Josh</div><div class=\"time-ago\">20m ago</div></div></li><li><div class=\"top\"><div class=\"icon\"></div><div class=\"title\">Screen shot of LHS ...</div><div class=\"dismiss\">Dismiss</div></div><div class=\"bottom\"><div class=\"actor\">Vardarmis, Torvic</div><div class=\"time-ago\">41m ago</div></div></li><li><div class=\"top\"><div class=\"icon\"></div><div class=\"title\">New Look and copy/paste</div><div class=\"dismiss\">Dismiss</div></div><div class=\"bottom\"><div class=\"actor\">Graham, Neale</div><div class=\"time-ago\">1d ago</div></div></li><li><div class=\"top\"><div class=\"icon\"></div><div class=\"title\">Exports error</div><div class=\"dismiss\">Dismiss</div></div><div class=\"bottom\"><div class=\"actor\">O'Connor, Colin</div><div class=\"time-ago\">1w ago</div></div></li><li><div class=\"top\"><div class=\"icon\"></div><div class=\"title\">CAL page sections...</div><div class=\"dismiss\">Dismiss</div></div><div class=\"bottom\"><div class=\"actor\">Zigler, Will</div><div class=\"time-ago\">2mo ago</div></div></li><li class=\"view-all\">View All</li></ul></li><li class=\"profile\"><div class=\"picture\"></div><div class=\"name\">Aharon Wasserman</div><div class=\"nub\"></div></li></ul></div>");;return buf.join("");
};
},{"jade/runtime":1}],5:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};

buf.push("<div class=\"van-header-backdrop\"></div><div class=\"van-header-wrapper\"><ul id=\"tabs\"><li data-color=\"#cc0000\" class=\"my-voters selected\">Voter Reg</li><li data-color=\"#12ae6a\" class=\"my-campaign\">My Members</li><li data-color=\"#e05f25\" class=\"my-workers\">My Workers</li><li data-color=\"#31bdb5\" class=\"my-casework\">My Voters</li><li data-color=\"#31bdb5\" class=\"my-casework\">Working America</li><li data-color=\"#31bdb5\" class=\"my-casework\">My Campaign</li></ul></div>");;return buf.join("");
};
},{"jade/runtime":1}],6:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};

buf.push("<div class=\"van-header-backdrop\"></div><div class=\"van-header-wrapper\"><ul id=\"tabs\"><li data-color=\"#3498DB\" class=\"my-voters selected\">My Voters</li><li data-color=\"#12ae6a\" class=\"my-campaign\">My Campaign</li><li data-color=\"#e05f25\" class=\"my-workers\">My Workers</li><li data-color=\"#31bdb5\" class=\"my-casework\">My Casework</li></ul></div>");;return buf.join("");
};
},{"jade/runtime":1}],7:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};

buf.push("<div id=\"publisher\"><div class=\"bar\"><div class=\"toggle\"></div><div class=\"arrow\"></div></div><div class=\"field\"><textarea placeholder=\"Share something...\"></textarea><div class=\"instructions\">Press ENTER to post</div></div></div><ul id=\"nf\"><li><div class=\"right\"><div class=\"headline\"><div class=\"author-name\">Aharon Wasserman</div><div class=\"author-position\">Field Organizer</div></div><div class=\"post-content\">Oh, it's a jolly holiday with Mary. Mary makes your 'eart so light. When the day is gray and ordinary, Mary makes the sun shine bright!</div><div class=\"footer\"><a class=\"time-ago\">5m ago</a><span class=\"dot\">•</span><a class=\"comment\">Comment</a><span class=\"dot\">•</span><a class=\"like\">Like</a></div><div class=\"interactions\"><div class=\"likes\"><span>Liked by</span><a class=\"name\">Rob Winikates</a><span>and</span><a class=\"others\">4 others</a></div><ul class=\"comments\"><li><div class=\"right\"><div class=\"comment-content\"><div class=\"commenter-name\">Rob Winikates</div><div class=\"comment-text\">Love that song.</div></div><div class=\"comment-footer\"><div class=\"comment-timestamp\">3m ago</div></div></div><div class=\"left\"><div style=\"background-image:url('https://scontent-a-lga.xx.fbcdn.net/hphotos-frc1/t1.0-9/1601277_10101210942613091_487320413_n.jpg')\" class=\"commenter-photo\"></div></div></li><li><div class=\"right\"><div class=\"comment-content\"><div class=\"commenter-name\">Aharon Wasserman</div><div class=\"comment-text\">Yeah, me too.</div></div><div class=\"comment-footer\"><div class=\"comment-timestamp\">1m ago</div></div></div><div class=\"left\"><div style=\"background-image:url('https://scontent-b-lga.xx.fbcdn.net/hphotos-frc3/t31.0-8/737027_10102205194030369_686311291_o.jpg')\" class=\"commenter-photo\"></div></div></li></ul><div class=\"post-comment\"><input placeholder=\"Write a comment...\"/></div></div></div><div class=\"left\"><div style=\"background-image:url('https://scontent-b-lga.xx.fbcdn.net/hphotos-frc3/t31.0-8/737027_10102205194030369_686311291_o.jpg')\" class=\"author-photo\"></div></div></li><li><div class=\"right\"><div class=\"headline\"><div class=\"author-name\">Rob Winikates</div><div class=\"author-position\">Regional Field Director</div></div><div class=\"post-content\">Interesting article on our race.<div class=\"link-box\"><div style=\"background-image:url('http://espnfivethirtyeight.files.wordpress.com/2014/03/477890567banner.jpg')\" class=\"link-photo\"></div><div class=\"link-title\">FiveThirtyEight Senate Forecast: GOP Is Slight Favorite in Race for Senate Control</div><div class=\"link-preview\">When FiveThirtyEight last issued a U.S. Senate forecast - way back in July - we concluded the race for Senate control was a toss-up. That was a little ahead of the...</div></div></div><div class=\"footer\"><a class=\"time-ago\">5m ago</a><span class=\"dot\">•</span><a class=\"comment\">Comment</a><span class=\"dot\">•</span><a class=\"like\">Like</a></div><div class=\"interactions\"><div class=\"likes\"><span>Liked by</span><a class=\"name\">John Lee</a><span>and</span><a class=\"others\">16 others</a></div><div class=\"post-comment\"><input placeholder=\"Write a comment...\"/></div></div></div><div class=\"left\"><div style=\"background-image:url('https://scontent-a-lga.xx.fbcdn.net/hphotos-frc1/t1.0-9/1601277_10101210942613091_487320413_n.jpg')\" class=\"author-photo\"></div></div></li><li><div class=\"right\"><div class=\"headline\"><div class=\"author-name\">Justin Lewis</div><div class=\"author-position\">CTO</div></div><div class=\"post-content\"><img src=\"http://designyoutrust.com/wp-content/uploads6/ob8.jpg\"/></div><div class=\"footer\"><a class=\"time-ago\">5m ago</a><span class=\"dot\">•</span><a class=\"comment\">Comment</a><span class=\"dot\">•</span><a class=\"like\">Like</a></div></div><div class=\"left\"><div style=\"background-image:url('https://scontent-b-lga.xx.fbcdn.net/hphotos-prn1/t31.0-8/886466_10101162219499827_494481719_o.jpg');background-position:90%;\" class=\"author-photo\"></div></div></li><li><div class=\"right\"><div class=\"headline\"><div class=\"author-name\">Stu Trevelyan</div><div class=\"author-position\">Finance Director</div></div><div class=\"post-content\">Oh 'appiness is bloomin' all around 'er. The daffoldils are smilin' at the dove. When Mary 'olds your 'and you feel so grand, your 'eart starts beatin' like a big brass band. Oh, it's a jolly holiday with Mary. No wonder that it's Mary that we love!</div><div class=\"footer\"><a class=\"time-ago\">5m ago</a><span class=\"dot\">•</span><a class=\"comment\">Comment</a><span class=\"dot\">•</span><a class=\"like\">Like</a></div></div><div class=\"left\"><div style=\"background-image:url('https://scontent-b-lga.xx.fbcdn.net/hphotos-frc3/t1.0-9/310253_10150309612795723_421724457_n.jpg')\" class=\"author-photo\"></div></div></li><li><div class=\"right\"><div class=\"headline\"><div class=\"author-name\">John Lee</div><div class=\"author-position\">Intern</div></div><div class=\"post-content\">Oh, it's a jolly holiday with Mary. Mary makes your 'eart so light. When the day is gray and ordinary, Mary makes the sun shine bright!</div><div class=\"footer\"><a class=\"time-ago\">5m ago</a><span class=\"dot\">•</span><a class=\"comment\">Comment</a><span class=\"dot\">•</span><a class=\"like\">Like</a></div></div><div class=\"left\"><div style=\"background-image:url('https://scontent-a-lga.xx.fbcdn.net/hphotos-frc3/t1.0-9/1375207_10100194950549360_503587346_n.jpg')\" class=\"author-photo\"></div></div></li><li><div class=\"right\"><div class=\"headline\"><div class=\"author-name\">Drew Miller</div><div class=\"author-position\">Press Secretary</div></div><div class=\"post-content\">Oh, it's a jolly holiday with Mary. Mary makes your 'eart so light. When the day is gray and ordinary, Mary makes the sun shine bright!</div><div class=\"footer\"><a class=\"time-ago\">5m ago</a><span class=\"dot\">•</span><a class=\"comment\">Comment</a><span class=\"dot\">•</span><a class=\"like\">Like</a></div></div><div class=\"left\"><div style=\"background-image:url('https://scontent-a-lga.xx.fbcdn.net/hphotos-frc1/t1.0-9/1601277_10101210942613091_487320413_n.jpg')\" class=\"author-photo\"></div></div></li></ul>");;return buf.join("");
};
},{"jade/runtime":1}],8:[function(require,module,exports){
var HeaderView, LANHeaderView, VANHeaderView, VANSocialView, Vanity, buttons, icons, vanity,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

buttons = require('./buttons.coffee').buttons;

icons = require('./icons.coffee').icons;

HeaderView = require('../src/templates/header.jade');

VANHeaderView = require('../src/templates/van-header.jade');

LANHeaderView = require('../src/templates/lan-header.jade');

VANSocialView = require('../src/templates/van-social.jade');

Vanity = (function() {
  function Vanity() {
    this.selectTab = __bind(this.selectTab, this);
    this.$body = $(document.body);
    this.addCss();
    this.moveGoToBar();
    this.insertNewLogo();
    this.insertCommitteeName();
    this.restyleLogin();
    this.restylePinPage();
    this.insertProfilePic();
    this.insertNewTabs();
    this.moveOldTabs();
    this.updateFooter();
    this.swapIcons();
    this.appendHeader();
    this.appendGlobalHeader();
    this.appendVANHeader();
    this.appendSocial();
  }

  Vanity.prototype.addCss = function() {
    this.appendStyleSheet('css/vanui.css');
    this.appendStyleSheet('css/header.css');
    this.appendStyleSheet('css/quick.css');
    this.appendStyleSheet('css/notifications.css');
    this.appendStyleSheet('css/social.css');
    return this.$body.css('display', 'block');
  };

  Vanity.prototype.appendStyleSheet = function(path) {
    var style;
    style = document.createElement('link');
    style.rel = 'stylesheet';
    style.type = 'text/css';
    style.href = chrome.extension.getURL(path);
    return (document.head || document.documentElement).appendChild(style);
  };

  Vanity.prototype.moveGoToBar = function() {
    return $(".masterbanner").insertBefore("#ctl00_MasterPageMainTable");
  };

  Vanity.prototype.insertNewLogo = function() {
    var logoURL;
    logoURL = chrome.extension.getURL('images/whiteCircles.svg');
    return $("<img id='ngpvan-logo-image' src='" + logoURL + "' />").insertBefore("#header-van-goto");
  };

  Vanity.prototype.insertCommitteeName = function() {
    var pageTitle;
    pageTitle = $(document).find("title").text();
    pageTitle = pageTitle.substring(0, pageTitle.indexOf("-") - 1);
    return $("<h1 id='ngpvan-logo-name'>" + pageTitle + "</h1>").insertAfter("#ngpvan-logo-image");
  };

  Vanity.prototype.restyleLogin = function() {
    if (document.location.href.indexOf('Login') > -1) {
      $(".masterbanner").remove();
      $('body').removeClass('Grey-body classicColor').addClass('justin-login-page');
      $('<div class="login-logo-big"><img src="' + logoURL + '" /></div>').insertBefore('#TableContentSetup');
      $('<div class="login-form"></div>').insertBefore('#TableContentSetup');
      $('#TableContentSetup').appendTo('.login-form');
      $('#ctl00_ContentPlaceHolderVANPage_TableCellLoginContentBkgdSpaceLeft').remove();
      return $('#ctl00_ContentPlaceHolderVANPage_TableCellLoginContentBkgdSpaceRight').remove();
    }
  };

  Vanity.prototype.restylePinPage = function() {
    if (document.location.href.indexOf('PIN') > -1) {
      return $('.login-form').css('width', '970px');
    }
  };

  Vanity.prototype.insertProfilePic = function() {
    var userphotoURL;
    userphotoURL = chrome.extension.getURL('images/justin.jpg');
    return $("<img id='ngpvan-user-image' src='" + userphotoURL + "' />").insertAfter('#context-header-div ul li:last-child');
  };

  Vanity.prototype.insertNewTabs = function() {
    return $("<div id='ngpvan-tabs-bar'></div>").insertBefore('.masterbanner');
  };

  Vanity.prototype.moveOldTabs = function() {
    return $("#header ul").appendTo('#ngpvan-tabs-bar');
  };

  Vanity.prototype.updateFooter = function() {
    return $('.footer').html('<span id="ctl00_LabelCopyright">&copy; 2014 NGP VAN, Inc - <a href="http://www.ngpvan.com/content/privacy-policy" target="_blank">Privacy Policy</a></span>');
  };

  Vanity.prototype.addIcon = function(selector, path) {
    return $(selector).html('<img src="' + chrome.extension.getURL(path) + '" />');
  };

  Vanity.prototype.swapIcons = function() {
    var button, icon, _i, _j, _len, _len1, _results;
    for (_i = 0, _len = icons.length; _i < _len; _i++) {
      icon = icons[_i];
      this.swapIcon(icon);
    }
    _results = [];
    for (_j = 0, _len1 = buttons.length; _j < _len1; _j++) {
      button = buttons[_j];
      _results.push(this.swapButton(button));
    }
    return _results;
  };

  Vanity.prototype.swapButton = function(icon) {
    if ($(icon.id).length) {
      return document.getElementById(icon.id).src = chrome.extension.getURL(icon.icon);
    }
  };

  Vanity.prototype.swapIcon = function(icon) {
    return $(icon.id).html('<img src="' + chrome.extension.getURL(icon.icon) + '" />');
  };

  Vanity.prototype.removeMenuTableBorder = function() {
    return $('.MenuTableNoBorder').css('border-top', '0');
  };

  Vanity.prototype.appendHeader = function() {
    var header;
    header = document.createElement('div');
    header.setAttribute('id', 'new-header');
    return this.$body.prepend($(header));
  };

  Vanity.prototype.appendGlobalHeader = function() {
    var globalHeader;
    globalHeader = document.createElement('div');
    globalHeader.setAttribute('id', 'global-header');
    $('#new-header').append($(globalHeader));
    $('#global-header').html(HeaderView({}));
    this.addIcon('#global-header .picture', 'images/aharon.jpg');
    return this.addIcon('.nub', 'images/nub.svg');
  };

  Vanity.prototype.appendVANHeader = function() {
    var VANHeader;
    VANHeader = document.createElement('div');
    VANHeader.setAttribute('id', 'van-header');
    $('#new-header').append($(VANHeader));
    $('#van-header').html(VANHeaderView({}));
    this.setLinkListeners();
    this.setSectionHeaderColor('#3498DB');
    return this.addIcon('#global-header .committee', 'images/new-votebuilder_light.svg');
  };

  Vanity.prototype.appendLANHeader = function() {
    var LANHeader;
    LANHeader = document.createElement('div');
    LANHeader.setAttribute('id', 'van-header');
    $('#new-header').append($(LANHeader));
    $('#van-header').html(LANHeaderView({}));
    this.setLinkListeners();
    this.setSectionHeaderColor('#cc0000');
    this.addIcon('#global-header .committee', 'images/aflcio.svg');
    return this.addIcon('#global-header .flag', 'images/flag.svg');
  };

  Vanity.prototype.appendSocial = function() {
    var HomeWrapper, VANSocial;
    HomeWrapper = document.createElement('div');
    HomeWrapper.setAttribute('class', 'home-wrapper');
    this.$body.append($(HomeWrapper));
    VANSocial = document.createElement('div');
    VANSocial.setAttribute('id', 'van-social');
    $('.home-wrapper').append($(VANSocial));
    $('#van-social').html(VANSocialView({}));
    return $('#publisher .bar .toggle').on('click', this.togglePublisher);
  };

  Vanity.prototype.toggleNotifications = function() {
    return $('.link.notifications').toggleClass('active');
  };

  Vanity.prototype.togglePublisher = function() {
    return $('#publisher').toggleClass('active');
  };

  Vanity.prototype.setLinkListeners = function() {
    $('#tabs li').on('click', this.selectTab);
    return $('.link.notifications').on('click', this.toggleNotifications);
  };

  Vanity.prototype.selectTab = function(e) {
    var $tab, color, tab, tabs, _i, _len;
    $tab = $(e.currentTarget);
    color = $tab.attr('data-color');
    tabs = $('#tabs li');
    for (_i = 0, _len = tabs.length; _i < _len; _i++) {
      tab = tabs[_i];
      $(tab).removeClass('selected');
    }
    $tab.addClass('selected');
    return this.setSectionHeaderColor(color);
  };

  Vanity.prototype.setSectionHeaderColor = function(color) {
    $('#global-header').css('background-color', color);
    $('.van-header-backdrop').css('background-color', color);
    $('.MenuTableHeader').css('background-color', color);
    $('.MenuTableHeader').css('color', '#ffffff');
    return $('.MenuTableHeader').css('opacity', '.7');
  };

  return Vanity;

})();

vanity = new Vanity;


},{"../src/templates/header.jade":4,"../src/templates/lan-header.jade":5,"../src/templates/van-header.jade":6,"../src/templates/van-social.jade":7,"./buttons.coffee":2,"./icons.coffee":3}],9:[function(require,module,exports){

},{}]},{},[8])