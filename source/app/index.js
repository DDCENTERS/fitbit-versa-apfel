import document from "document";

import * as simpleSettings from "./simple/device-settings";
import * as simpleActivity from "./simple/activity";
import * as simpleBattery from "./simple/battery";
import * as simpleClock from "./simple/clock";
import * as simpleHRM from "./simple/hrm";
import * as simpleWeather from "./simple/weather";

//var CLOCK = document.getElementById("CLOCK");
var HOUR = document.getElementById("HOUR");
var MINUTE = document.getElementById("MINUTE");
var DAY = document.getElementById("DAY");
var DATE = document.getElementById("DATE");
var HRM = document.getElementById("HRM");
var STEPS = document.getElementById("STEPS");
var DIST = document.getElementById("DIST");
var CALS = document.getElementById("CALS");
var BATTERY = document.getElementById("BATTERY");
var ARCBAT = document.getElementById("ARC-BAT");
var ARCPROGRESS = document.getElementById("ARC-PROGRESS");
var ARCCALS = document.getElementById("ARC-CALS");
var ARCDIST = document.getElementById("ARC-DIST");
var ARCSTEPS = document.getElementById("ARC-STEPS");
var TEMP = document.getElementById("TEMP");
var WEATHER = document.getElementById("WEATHER");

var COLOR, CITY, APIKEY;
var PROGRESS_WIDGET = true;
var WEATHER_WIDGET = false;

/* -------- SETTINGS -------- */
function settingsCallback(data) {
  if (!data) {
    return false;
  }
  COLOR = data.color;
  CITY = data.city;
  APIKEY = data.api;
  WEATHER_WIDGET = data.weatherwidget;

  if (WEATHER_WIDGET){
    PROGRESS_WIDGET = false;
    ARCPROGRESS.sweepAngle = 0;
    ARCCALS.sweepAngle = 0;
    ARCDIST.sweepAngle = 0;
    ARCSTEPS.sweepAngle = 0;
  }else{
    PROGRESS_WIDGET = true;
  }
  
  simpleActivity.enableWidget(PROGRESS_WIDGET);
  simpleWeather.enableWidget(WEATHER_WIDGET);
  simpleClock.setTheme(COLOR);
  simpleWeather.setLocation(CITY);
  simpleWeather.setApiKey(APIKEY);
}
simpleSettings.initialize(settingsCallback);

/* --------- CLOCK ---------- */
function clockCallback(data) {
  //CLOCK.text = data.time;
  HOUR.text = data.hour;
  MINUTE.text = data.minute;
  DAY.text = data.date;
  DATE.text = data.day;
}
simpleClock.initialize("minutes", "Day", clockCallback);

/* ------- ACTIVITY --------- */
function activityCallback(data) {
  STEPS.text = data["steps"];
  CALS.text = data["calories"];
  DIST.text = data["distance"];
  //console.log('widget: '+data['arc']);
  if (data["arc"]){
    ARCPROGRESS.sweepAngle = 360;
    ARCCALS.sweepAngle = data.stepangle;
    ARCDIST.sweepAngle = data.distangle;
    ARCSTEPS.sweepAngle = data.calsangle;
  }
}
simpleActivity.initialize(activityCallback);

/* -------- HRM ------------- */
function hrmCallback(data) {
  HRM.text = data.bpm;
}
simpleHRM.initialize(hrmCallback);

/* -------- BATTERY ---------- */
function batteryCallback(data) {
  BATTERY.text = data.battery;
  ARCBAT.sweepAngle = data.angle;
  ARCBAT.style.fill = data.color;
  ARCBAT.style.opacity = data.opacity;
}
simpleBattery.initialize(batteryCallback);

/* -------- WEATHER ---------- */
function weatherCallback(data) {
  TEMP.text = data.temp;
  WEATHER.href = data.href;
}
simpleWeather.initialize(weatherCallback);