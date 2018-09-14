import { display } from "display";
import { today, goals } from "user-activity";
import { units } from "user-settings";

var activityCallback, watchID;
var ENABLED = true;

export function initialize(callback) {
  activityCallback = callback;
  setupEvents();
  start();
}

export function enableWidget(status) {
  ENABLED = status;
}

function getSteps() {
  let val = (today.adjusted.steps || 0);
  return {
    raw: val,
    pretty: val > 999 ? Math.floor(val/1000) + "'" + ("00"+(val%1000)).slice(-3) : val
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

function getActiveMinutes() {
  let val = (today.adjusted.activeMinutes || 0);
  return {
    raw: val,
    pretty: (val < 60 ? "" : Math.floor(val/60) + "h,") + ("0" + (val%60)).slice("-2") + "m"
  }
}

function getElevationGain() {
  let val = today.adjusted.elevationGain || 0;
  return {
    raw: val,
    pretty: `+${val}`
  }
}

function getActivity(type, values) {
  if (type == 'now'){
    return {
      steps: getSteps(),
      calories: getCalories(),
      distance: getDistance()
    }
  }else if (type == 'goal'){
    let stepgoal = (values['steps']['raw'] / goals.steps * 360); //if (stepgoal > 360) { stepgoal = 360; }
    let calgoal = (values['calories']['raw'] / goals.calories * 360); //if (calgoal > 360) { calgoal = 360; }
    let distgoal = (values['distance']['raw'] * 1000 / goals.distance * 360); //if (distgoal > 360) { distgoal = 360; } 

    return {
      steps: Math.floor(stepgoal),
      calories: Math.floor(calgoal),
      distance: Math.floor(distgoal),
    }
  }
}

function getReading() {
  let values = getActivity('now');
  let arcs = getActivity('goal', values);

  activityCallback({
    steps: values['steps']['pretty'],
    calories: values['calories']['pretty'],
    distance: values['distance']['pretty'],
    arc: ENABLED,
    stepangle: arcs['steps'],
    calsangle: arcs['calories'],
    distangle: arcs['distance']
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