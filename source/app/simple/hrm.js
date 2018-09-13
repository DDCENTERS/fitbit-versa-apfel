import { display } from "display";
import { HeartRateSensor } from "heart-rate";
import { user } from "user-profile";

let hrm, watchID, hrmCallback;
let lastReading = 0;
let heartRate;

export function initialize(callback) {
  hrmCallback = callback;
  hrm = new HeartRateSensor();
  setupEvents();
  start();
  lastReading = hrm.timestamp;
}

function getReading() {
  if (hrm.timestamp === lastReading || hrm.heartRate == null) {
    heartRate = "--";
  } else {
    heartRate = hrm.heartRate;
  }
  lastReading = hrm.timestamp;
  hrmCallback({
    bpm: heartRate,
    zone: user.heartRateZone(hrm.heartRate || 0),
    restingHeartRate: user.restingHeartRate
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
    hrm.start();
    getReading();
    //update hrm every second while display on 
    watchID = setInterval(getReading, 1000);
  }
}

function stop() {
  hrm.stop();
  if (watchID) {
    clearInterval(watchID);
    watchID = null;
  }
}