import clock from "clock";
import { display } from "display";
import { today, goals } from "user-activity";
import { units } from "user-settings";

var activityCallback, watchID;

export function initialize(callback) {
  activityCallback = callback;
  setupEvents();
  start();
}

function getActiveMinutes() {
  let val = (today.adjusted.activeMinutes || 0);
  return {
    raw: val,
    pretty: (val < 60 ? "" : Math.floor(val/60) + "h,") + ("0" + (val%60)).slice("-2") + "m"
  }
}

function getCalories() {
  let val = (today.adjusted.calories || 0);
  return {
    raw: val,
    pretty: val > 999 ? Math.floor(val/1000) + "'" + ("00"+(val%1000)).slice(-3) : val
  }
}

function getDistance() {
  let val = (today.adjusted.distance || 0) / 1000;
  let u = "km";
  if(units.distance === "us") {
    val *= 0.621371;
    u = "mi";
  }
  return {
    raw: val,
    pretty: `${val.toFixed(2)}${u}`
  }
}

function getElevationGain() {
  let val = today.adjusted.elevationGain || 0;
  return {
    raw: val,
    pretty: `+${val}`
  }
}

function getSteps() {
  let val = (today.adjusted.steps || 0);
  return {
    raw: val,
    pretty: val > 999 ? Math.floor(val/1000) + "'" + ("00"+(val%1000)).slice(-3) : val
  }
}

function getReading() {
  activityCallback({
    steps: getSteps(),
    calories: getCalories(),
    distance: getDistance(),
    elevationGain: getElevationGain(),
    activeMinutes: getActiveMinutes()
  });
}

function setupEvents() {
  display.addEventListener("change", function() {
    if (display.on) {
      start();
    } else {
      stop();
    }
  });
}

function start() {
  if (!watchID) {
    getReading();
    //update activity every second
    //watchID = setInterval(getReading, 1000);
  }
}

function stop() {
  if (watchID) {
    clearInterval(watchID);
    watchID = null;
  }
}