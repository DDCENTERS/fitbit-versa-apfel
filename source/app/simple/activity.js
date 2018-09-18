import { display } from "display";
import { today, goals } from "user-activity";
import { units } from "user-settings";

var activityCallback, watchID;
var ENABLED = true;
var ACTIVITY = {};

export function initialize(callback) {
  activityCallback = callback;
  setupEvents();
  start();
}

export function enableWidget(status) {
  ENABLED = status;
}

export function setActivity(top, middle, bottom) {
  ACTIVITY['top'] = top;
  ACTIVITY['middle'] = middle;
  ACTIVITY['bottom'] = bottom;
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
  let u = " kcal";
  return {
    raw: val,
    pretty: val > 999 ? `${Math.floor(val/1000) + "'" + ("00"+(val%1000)).slice(-3)}${u}` : `${val}${u}`
  }
}

function getDistance() {
  let val = (today.adjusted.distance || 0);
  let u = " km";
  if(units.distance === "us") {
    val *= 0.621371;
    u = " mi";
  }
  return {
    raw: val,
    pretty: `${(val / 1000).toFixed(2)}${u}`
  }
}

function getActiveMinutes() {
  let val = (today.adjusted.activeMinutes || 0);
  return {
    raw: val,
    pretty: (val < 60 ? "" : Math.floor(val/60) + "h ") + ("0" + (val%60)).slice("-2") + "m"
  }
}

function getElevation() {
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
      distance: getDistance(),
      activemin: getActiveMinutes(),
      elevation: getElevation()
    }
  }else if (type == 'goal'){
    let steps_goal = (values['steps']['raw'] / goals.steps * 360); //if (stepgoal > 360) { stepgoal = 360; }
    let calories_goal = (values['calories']['raw'] / goals.calories * 360); //if (calgoal > 360) { calgoal = 360; }
    let distance_goal = (values['distance']['raw'] / goals.distance * 360); //if (distgoal > 360) { distgoal = 360; } 
    let activemin_goal = (values['activemin']['raw'] / goals.activeMinutes * 360); //if (distgoal > 360) { distgoal = 360; } 
    let elevation_goal = (values['elevation']['raw'] / goals.elevationGain * 360); //if (distgoal > 360) { distgoal = 360; } 

    return {
      steps: Math.floor(steps_goal),
      calories: Math.floor(calories_goal),
      distance: Math.floor(distance_goal),
      activemin: Math.floor(activemin_goal),
      elevation: Math.floor(elevation_goal)
    }
  }
}

function getReading() {
  let values = getActivity('now');
  let arcs = getActivity('goal', values);

  activityCallback({
    val_top: values[ACTIVITY['top']]['pretty'],
    val_middle: values[ACTIVITY['middle']]['pretty'],
    val_bottom: values[ACTIVITY['bottom']]['pretty'],
    arc: ENABLED,
    arc_outside: arcs[ACTIVITY['top']],
    arc_middle: arcs[ACTIVITY['middle']],
    arc_center: arcs[ACTIVITY['bottom']]
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