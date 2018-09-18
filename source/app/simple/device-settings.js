/*
  Responsible for loading, applying and saving settings.
  Requires companion/simple/companion-settings.js
  Callback should be used to update your UI.
*/
import { me } from "appbit";
import * as fs from "fs";
import * as messaging from "messaging";

const SETTINGS_TYPE = "cbor";
const SETTINGS_FILE = "settings.cbor";

var settingCallback, topActivity, middleActivity, bottomActivity;

var customColor = "colored";
var customCity = "gps";
var customApiKey = "";
var weatherWidget = false;
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
  //console.log('reading settings');
  if (data.colorToggle) {
    customColor = data.customColor;
  }else{
    customColor = "colored";
  }
  //console.log('reading color setting');

  if (data.weatherToggle && data.apiKey) {
    weatherWidget = true;
    customApiKey = data.apiKey.name;
  }else{
    weatherWidget = false;
    customApiKey = "";
  }
  //console.log('reading weather widget setting');
  
  if (data.locationToggle && data.customCity) {
    customCity = data.customCity.name;
  }else{
    customCity = "gps";
  }
  //console.log('reading static location setting');
  if (data.topActivity){
    //console.log(JSON.stringify(data.topActivity.values));
    topActivity = data.topActivity.values[0]["name"];
  }else{
    topActivity = "steps";
  }

  if (data.middleActivity){
    middleActivity = data.middleActivity.values[0]["name"];
  }else{
    middleActivity = "calories";
  }

  if (data.bottomActivity){
    bottomActivity = data.bottomActivity.values[0]["name"];
  }else{
    bottomActivity = "activemin";
  }
  //console.log('reading activity setting');
  
  settingCallback({
   "color": customColor,
   "city": customCity,
   "api": customApiKey,
   "weatherwidget": weatherWidget,
   "topactivity": topActivity,
   "middleactivity": middleActivity,
   "bottomactivity": bottomActivity
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