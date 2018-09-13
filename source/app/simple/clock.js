import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import { days, months, monthsShort } from "./locales/en.js";
import * as util from "./utils";

var DAY = document.getElementById("DAY");
var STEPS = document.getElementById("STEPS_CLR");
var DIST = document.getElementById("DIST_CLR");
var CALS = document.getElementById("CALS_CLR");
var BPM = document.getElementById("BPM");

var dateFormat, clockCallback;
var COLOR = "colored";

var ThemeARRAY = {
  "#fa114f" : "pink",
  "#ff3b30" : "red",
  "#ff9500" : "orange",
  "#ffe620" : "yellow",
  "#04de71" : "green",
  "#00f5ea" : "teal",
  "#5ac8fa" : "blue-light",
  "#2094fa" : "blue",
  "#787aff" : "purple",
}

export function initialize(granularity, dateFormatString, callback) {
  dateFormat = dateFormatString;
  clock.granularity = granularity;
  clockCallback = callback;
  clock.addEventListener("tick", tickHandler);
}

export function setTheme(customColor) {
  COLOR = customColor;
  setColor(COLOR);
}

function setColor(COLOR) {
  if (COLOR === "colored"){
    console.log("changing theme color to default");
    //RESTORE DEFAULT THEME
    DAY.style.fill = "#ff3b30"; //red
    STEPS.style.fill = "#5ac8fa"; //blue-light
    DIST.style.fill = "#04de71"; //green
    CALS.style.fill = "#fa114f"; //pink
    BPM.style.fill = "#ff3b30"; //red
  }else{
    console.log("changing theme color to "+ThemeARRAY[COLOR]);
    DAY.style.fill = COLOR;
    STEPS.style.fill = COLOR;
    DIST.style.fill = COLOR;
    CALS.style.fill = COLOR;
    BPM.style.fill = COLOR;
  }
}

function tickHandler(evt) {
  let today = evt.date;
  let dayName = days[today.getDay()];
  let month = util.zeroPad(today.getMonth() + 1);
  let monthName = months[today.getMonth()];
  let monthNameShort = monthsShort[today.getMonth()];
  let dayNumber = util.zeroPad(today.getDate());
  let hours = today.getHours();
  let mins = today.getMinutes();
  
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  mins = util.zeroPad(mins);

  let timeString = `${hours}:${mins}`;
  let hourString = `${hours}`;
  let minuteString = `${mins}`;
  let dateString = today;
  let dayString = today;

  switch(dateFormat) {
    case "shortDate":
      dateString = `${dayNumber} ${monthNameShort}`;
      break;
    case "mediumDate":
      dateString = `${dayNumber} ${monthName}`;
      break;
    case "longDate":
      dateString = `${dayName} ${monthName} ${dayNumber}`;
      break;
    case "Day":
      dateString = `${dayName}`;
      dayString = `${dayNumber}`;
      break;
  }
  clockCallback({time: timeString, hour: hourString, minute: minuteString, date: dateString, day: dayString});
}
