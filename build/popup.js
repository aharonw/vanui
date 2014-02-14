// Generated by CoffeeScript 1.7.1
(function() {
  var convertToReadableHotkey, defaultKey, extractConfigFromEvent, extractModifierFromEvent;

  defaultKey = {
    keyCode: 75,
    ctrlKey: true,
    altKey: false,
    metaKey: false,
    shiftKey: false
  };

  $(function() {
    chrome.storage.sync.get("config", function(items) {
      if (items.config != null) {
        return $('input#tabswitcher-settings-hotkey-input').val(convertToReadableHotkey(items.config));
      } else {
        return chrome.storage.sync.set({
          config: defaultKey
        }, function() {
          return $('input#tabswitcher-settings-hotkey-input').val(convertToReadableHotkey(defaultKey));
        });
      }
    });
    return $('input#tabswitcher-settings-hotkey-input').keydown(function(event) {
      if (event.keyCode !== 27) {
        chrome.storage.sync.set({
          config: extractConfigFromEvent(event)
        }, function() {
          return null;
        });
      } else {
        window.close();
        return;
      }
      $('input#tabswitcher-settings-hotkey-input').val(convertToReadableHotkey(event));
      return false;
    });
  });

  convertToReadableHotkey = function(event) {
    return "" + (extractModifierFromEvent(event)) + "+ " + (String.fromCharCode(event.keyCode));
  };

  extractConfigFromEvent = function(event) {
    return {
      keyCode: event.keyCode,
      ctrlKey: event.ctrlKey,
      altKey: event.altKey,
      metaKey: event.metaKey,
      shiftKey: event.shiftKey
    };
  };

  extractModifierFromEvent = function(event) {
    var modifier;
    modifier = "";
    if (event.ctrlKey) {
      modifier += 'Ctrl ';
    }
    if (event.altKey) {
      modifier += 'Alt ';
    }
    if (event.metaKey) {
      modifier += 'Cmd ';
    }
    if (event.shiftKey) {
      modifier += 'Shift ';
    }
    return modifier;
  };

}).call(this);
