import document from "document";

import * as simpleSettings from "./simple/device-settings";
import * as simpleActivity from "./simple/activity";
import * as simpleBattery from "./simple/battery";
import * as simpleClock from "./simple/clock";
import * as simpleHRM from "./simple/hrm";
import * as simpleWeather from "./simple/weather";

var TIME = document.getElementById("TIME");
var DAY = document.getElementById("DAY");
var DATE = document.getElementById("DATE");
var HRM = document.getElementById("HRM");
var HEART = document.getElementById("HEART");
var BPM = document.getElementById("BPM");

var ACT_TEXT = {
  'calories' : 'CALS',
  'distance' : 'DIST',
  'steps' : 'STEPS',
  'activemin' : 'ACTIVE',
  'elevation' : 'FLOOR'
}

var ACT_TEXT_TOP = document.getElementById("ACTIVITY-TEXT-TOP");
var ACT_TEXT_MIDDLE = document.getElementById("ACTIVITY-TEXT-MIDDLE");
var ACT_TEXT_BOTTOM = document.getElementById("ACTIVITY-TEXT-BOTTOM");

var ACT_VAL_TOP = document.getElementById("ACTIVITY-VALUE-TOP");
var ACT_VAL_MIDDLE = document.getElementById("ACTIVITY-VALUE-MIDDLE");
var ACT_VAL_BOTTOM = document.getElementById("ACTIVITY-VALUE-BOTTOM");

var ACT_ARC_OUTSIDE = document.getElementById("ACTIVITY-ARC-OUTSIDE");
var ACT_ARC_MIDDLE = document.getElementById("ACTIVITY-ARC-MIDDLE");
var ACT_ARC_CENTER = document.getElementById("ACTIVITY-ARC-CENTER");

var PROGRESS_ARC = document.getElementById("PROGRESS-ARC");
var BATTERY = document.getElementById("BATTERY");
var BATTERY_ARC = document.getElementById("BATTERY-ARC");
var TEMP = document.getElementById("TEMP");
var WEATHER = document.getElementById("WEATHER");

var COLOR, CITY, APIKEY;
var PROGRESS_WIDGET = true;
var WEATHER_WIDGET = false;

//console.log("debug: variables defined");

/* -------- SETTINGS -------- */
function settingsCallback(data) {
  if (!data) {
    return false;
  }

  //CUSTOM THEME COLOR
  COLOR = data.color;
  simpleClock.setTheme(COLOR);
  //console.log("debug: color theme loaded");

  //CUSTOM WEATHER CITY
  CITY = data.city;
  simpleWeather.setLocation(CITY);
  //console.log("debug: location loaded");

  //WEATHER API KEY
  APIKEY = data.api;
  simpleWeather.setApiKey(APIKEY);
  //console.log("debug: api key loaded");
  
  //PROGRESS OR WEATHER WIDGET
  WEATHER_WIDGET = data.weatherwidget;
  if (WEATHER_WIDGET){
    PROGRESS_WIDGET = false;
    PROGRESS_ARC.sweepAngle = 0;
    ACT_ARC_OUTSIDE.sweepAngle = 0;
    ACT_ARC_MIDDLE.sweepAngle = 0;
    ACT_ARC_CENTER.sweepAngle = 0;
  }else{
    PROGRESS_WIDGET = true;
  }
  simpleActivity.enableWidget(PROGRESS_WIDGET);
  simpleWeather.enableWidget(WEATHER_WIDGET);
  //console.log("debug: widget configuration loaded");

  //ACTIVITY
  ACT_TEXT_TOP.text = ACT_TEXT[data.topactivity];
  ACT_TEXT_MIDDLE.text = ACT_TEXT[data.middleactivity];
  ACT_TEXT_BOTTOM.text = ACT_TEXT[data.bottomactivity];
  simpleActivity.setActivity(data.topactivity, data.middleactivity, data.bottomactivity);
  //console.log("debug: activity configuration loaded");
}
simpleSettings.initialize(settingsCallback);
//console.log("debug: settings loaded");

/* --------- CLOCK ---------- */
function clockCallback(data) {
  TIME.text = data.time;
  DAY.text = data.date;
  DATE.text = data.day;
}
simpleClock.initialize("minutes", "Day", clockCallback);
//console.log("debug: time updated");

/* ------- ACTIVITY --------- */
function activityCallback(data) {
  ACT_VAL_TOP.text = data.val_top;
  ACT_VAL_MIDDLE.text = data.val_middle;
  ACT_VAL_BOTTOM.text = data.val_bottom;
  //console.log('widget: '+data['arc']);
  if (data.arc){
    PROGRESS_ARC.sweepAngle = 360;
    ACT_ARC_OUTSIDE.sweepAngle = data.arc_outside;
    ACT_ARC_MIDDLE.sweepAngle = data.arc_middle;
    ACT_ARC_CENTER.sweepAngle = data.arc_center;
  }
}
simpleActivity.initialize(activityCallback);
//console.log("debug: activity updated");

/* -------- HRM ------------- */
function hrmCallback(data) {
  HRM.text = data.bpm;
  if (!data.bpm) {
    HEART.style.opacity = 0;
    BPM.style.opacity = 0;
  }else{
    HEART.style.opacity = 1;
    BPM.style.opacity = 1;
  }
}
simpleHRM.initialize(hrmCallback);
//console.log("debug: heartrate updated");

/* -------- BATTERY ---------- */
function batteryCallback(data) {
  BATTERY.text = data.battery;
  BATTERY_ARC.sweepAngle = data.angle;
  BATTERY_ARC.style.fill = data.color;
  BATTERY_ARC.style.opacity = data.opacity;
}
simpleBattery.initialize(batteryCallback);
//console.log("debug: battery updated");

/* -------- WEATHER ---------- */
function weatherCallback(data) {
  TEMP.text = data.temp;
  WEATHER.href = data.href;
}
simpleWeather.initialize(weatherCallback);
//console.log("debug: weather updated");