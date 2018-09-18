import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import { days, months, monthsShort } from "./locales/en.js";
import * as util from "./utils";

var DAY = document.getElementById("DAY");
var BPM = document.getElementById("BPM");

var ACT_TEXT_TOP = document.getElementById("ACTIVITY-TEXT-TOP");
var ACT_TEXT_MIDDLE = document.getElementById("ACTIVITY-TEXT-MIDDLE");
var ACT_TEXT_BOTTOM = document.getElementById("ACTIVITY-TEXT-BOTTOM");

var ACT_ARC_OUTSIDE = document.getElementById("ACTIVITY-ARC-OUTSIDE");
var ACT_ARC_MIDDLE = document.getElementById("ACTIVITY-ARC-MIDDLE");
var ACT_ARC_CENTER = document.getElementById("ACTIVITY-ARC-CENTER");

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
    //console.log("changing theme color to default");
    //RESTORE DEFAULT THEME
    DAY.style.fill = "#ff3b30"; //red
    BPM.style.fill = "#ff3b30"; //red

    ACT_TEXT_TOP.style.fill = "#fa114f"; //pink
    ACT_TEXT_MIDDLE.style.fill = "#04de71"; //green
    ACT_TEXT_BOTTOM.style.fill = "#5ac8fa"; //blue-light

    ACT_ARC_OUTSIDE.style.fill = "#fa114f"; //pink
    ACT_ARC_MIDDLE.style.fill = "#04de71"; //green
    ACT_ARC_CENTER.style.fill = "#5ac8fa"; //blue-light
  }else{
    //console.log("changing theme color to "+ThemeARRAY[COLOR]);
    DAY.style.fill = COLOR;
    BPM.style.fill = COLOR;

    ACT_TEXT_TOP.style.fill = COLOR;
    ACT_TEXT_MIDDLE.style.fill = COLOR;
    ACT_TEXT_BOTTOM.style.fill = COLOR;
    
    ACT_ARC_OUTSIDE.style.fill = COLOR;
    ACT_ARC_MIDDLE.style.fill = COLOR;
    ACT_ARC_CENTER.style.fill = COLOR;
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
