Buttons = [

  {
    id: 'ctl00_ContentPlaceHolderVANPage_ctl13_ImageButtonSavePageLayoutEID4105EACActions'
    icon: 'images/glyphicons_406_sort-by-order.png'
  }
  
  {
    id: 'ctl00_ContentPlaceHolderVANPage_ctl04_StandardViewButton'
    icon: 'images/glyphicons_039_notes.png'
  }
  
  {
    id: 'ctl00_ContentPlaceHolderVANPage_ControlPanel_StandardViewButton'
    icon: 'images/glyphicons_039_notes.png'
  }
  
  {
    id: 'ctl00_ContentPlaceHolderVANPage_ctl04_ScriptViewButton'
    icon: 'images/glyphicons_114_list.png'
  }
  
  {
    id: 'ctl00_ContentPlaceHolderVANPage_ControlPanel_ScriptViewButton'
    icon: 'images/glyphicons_114_list.png'
  }
  
  {
    id: 'ctl00_ContentPlaceHolderVANPage_ctl04_FormViewButton'
    icon: 'images/glyphicons_319_sort.png'
  }
  
  {
    id: 'ctl00_ContentPlaceHolderVANPage_ControlPanel_SettingsButton'
    icon: 'images/glyphicons_280_settings.png'
  }
  
  {
    id: 'ctl00_ContentPlaceHolderVANPage_ctl04_PrintViewButton'
    icon: 'images/glyphicons_015_print.png'
  }
  
  {
    id: 'ctl00_ContentPlaceHolderVANPage_ControlPanel_PrintViewButton'
    icon: 'images/glyphicons_015_print.png'
  }
  
  {
    id: 'ctl00_ContentPlaceHolderVANPage_ctl04_SaveButton'
    icon: 'images/glyphicons_414_disk_save.png'
  }
  
  {
    id: 'ctl00_ContentPlaceHolderVANPage_ControlPanel_SaveButton'
    icon: 'images/glyphicons_414_disk_save.png'
  }

]

swap = (icon) ->
  if $(icon.id).length
    document.getElementById(icon.id).src = chrome.extension.getURL(icon.icon)

init = ->
  $('#ctl00_ContentPlaceHolderVANPage_ctl04_ClearLink').html('<img id="ctl00_ContentPlaceHolderVANPage_ctl04_ClearButton" title="Clear" src="' + chrome.extension.getURL('images/glyphicons_207_remove_2.png') + '" />');
  $('#ctl00_ContentPlaceHolderVANPage_ControlPanel_ClearLink').html('<img id="ctl00_ContentPlaceHolderVANPage_ControlPanel_ClearButton" title="Clear" src="' + chrome.extension.getURL('images/glyphicons_207_remove_2.png') + '" />');
  swap icon for icon in Icons

init()
  