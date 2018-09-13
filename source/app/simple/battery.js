import { display } from "display";
import { battery } from "power";

var batteryCallback, watchID, batteryOpa, batteryCol;

export function initialize(callback) {
  batteryCallback = callback;
  setupEvents();
  start();
}

function getBatteryPercent() {
  return battery.chargeLevel;
}

function getBatteryColor(value) {
  if (value <= 10) {
    batteryCol = '#ff3b30'; //red
    batteryOpa = 0.83;
  } else if (value <= 25) {
    batteryCol = '#ff9500'; //orange
    batteryOpa = 0.85;
  } else {
    batteryCol = '#04de71'; //green
    batteryOpa = 0.86;
  }
  return {color: batteryCol, opacity: batteryOpa};
}

function getReading() {
  let percent = Math.round(getBatteryPercent());
  let style = getBatteryColor(percent);
  let angle = (percent/100)*360;
  
  batteryCallback({
    battery: percent,
    color: style['color'],
    opacity: style['opacity'],
    angle: angle
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
    //update battery every second
    //watchID = setInterval(getReading, 1000);
  }
}

function stop() {
  if (watchID) {
    clearInterval(watchID);
    watchID = null;
  }
}