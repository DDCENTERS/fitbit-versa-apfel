/*
  Responsible for loading, applying and saving settings.
  Requires companion/simple/companion-settings.js
  Callback should be used to update your UI.
*/
import { me } from "appbit";
import { me as device } from "device";
import * as fs from "fs";
import * as messaging from "messaging";

const SETTINGS_TYPE = "cbor";
const SETTINGS_FILE = "settings.cbor";

var settingCallback;

var customColor = "colored";
var customCity = "gps";
var customApiKey = "";
var settings = {};

export function initialize(callback) {
  settings = loadSettings();
  settingCallback = callback;
  checkSettings(settings);
}

// Received message containing settings data
messaging.peerSocket.addEventListener("message", function(evt) {
  if (evt.data.key) {
    settings[evt.data.key] = evt.data.value;
    onsettingschange(settings);
  }  
})

function onsettingschange(data) {
  // Apply colors to elements
  if (!data) {
   return;
  }
  checkSettings(data);
}

function checkSettings(data) {
  if (data.colorToggle) {
    customColor = data.customColor;
  }else{
    customColor = "colored";
  }
  
  if (data.weatherToggle) {
    customCity = data.customCity.name;
  }else{
    customCity = "gps";
  }
  
  if (data.apiKey) {
    customApiKey = data.apiKey.name;
  }
  
  settingCallback({
   "color" : customColor,
   "city" : customCity,
   "api" : customApiKey
  });
}

// Register for the unload event
me.addEventListener("unload", saveSettings);

// Load settings from filesystem
function loadSettings() {
  try {
    return fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
  } catch (ex) {
    return {};
  }
}

// Save settings to the filesystem
function saveSettings() {
  fs.writeFileSync(SETTINGS_FILE, settings, SETTINGS_TYPE);
}