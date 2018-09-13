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
var BPM = document.getElementById("BPM");
var HRM = document.getElementById("HRM");
var STEPS = document.getElementById("STEPS");
var DIST = document.getElementById("DIST");
var CALS = document.getElementById("CALS");
var BATTERY = document.getElementById("BATTERY");
var ARC = document.getElementById("ARC");
var TEMP = document.getElementById("TEMP");
var WEATHER = document.getElementById("WEATHER");

var COLOR, CITY, APIKEY;

/* -------- SETTINGS -------- */
function settingsCallback(data) {
  if (!data) {
    return;
  }
  COLOR = data.color;
  CITY = data.city;
  APIKEY = data.api;
  
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
  STEPS.text = data["steps"]["pretty"];
  CALS.text = data["calories"]["pretty"];
  DIST.text = data["distance"]["pretty"];
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
  ARC.sweepAngle = data.angle;
  ARC.style.fill = data.color;
  ARC.style.opacity = data.opacity;
}
simpleBattery.initialize(batteryCallback);

/* -------- WEATHER ---------- */
function weatherCallback(data) {
  TEMP.text = data.temp;
  WEATHER.href = data.href;
}
simpleWeather.initialize(weatherCallback);