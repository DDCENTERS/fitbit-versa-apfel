import document from "document";
import { geolocation } from "geolocation";
import { display } from "display";
import * as messaging from "messaging";
import * as util from "./utils";
import { units } from "user-settings";


var watchID, icon, weatherCallback, weatherLocation, temperatureUnit, apiKey;
var CITY = "gps";
var UNITS = "metric";
var APIKEY = "";
var ENABLED = false;

if (units.temperature == "F") {
  UNITS = "imperial";
}

var weatherIcons = {
  200 : "thunder",
  201 : "thunder",
  202 : "thunder",
  210 : "thunder",
  211 : "thunder",
  212 : "thunder",
  221 : "thunder",
  230 : "thunder",
  231 : "thunder",
  232 : "thunder",
  300 : "rain-light",
  301 : "rain-light",
  302 : "rain-light",
  310 : "rain-light",
  311 : "rain-light",
  312 : "rain-light",
  313 : "rain-light",
  314 : "rain-light",
  321 : "rain-light",
  500 : "rain-light",
  501 : "rain",
  502 : "rain-heavy",
  503 : "rain-heavy",
  504 : "rain-heavy",
  511 : "rain",
  520 : "rain-light",
  521 : "rain",
  522 : "rain-heavy",
  531 : "rain-heavy",
  600 : "snow",
  601 : "snow",
  602 : "snow",
  611 : "snow",
  612 : "snow",
  615 : "snow",
  616 : "snow",
  620 : "snow",
  621 : "snow",
  622 : "snow",
  701 : "unknown",
  711 : "unknown",
  721 : "haze",
  731 : "unknown",
  741 : "fog",
  751 : "unknown",
  761 : "unknown",
  762 : "unknown",
  771 : "unknown",
  781 : "unknown",
  800 : "sunny",
  801 : "sunny-cloud",
  802 : "cloud",
  803 : "cloud",
  804 : "cloud"
}

export function initialize(callback) {
  weatherCallback = callback;
  setupEvents();
  if (ENABLED){
    start();
  }
}

export function enableWidget(status) {
  ENABLED = status;
}

export function setLocation(customCity) {
  CITY = customCity;
}

export function setApiKey(customApiKey) {
  APIKEY = customApiKey;
}

// Request weather data from the companion
function fetchWeather() {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    if (CITY == "gps") {
       geolocation.getCurrentPosition(
        (position) => {
          weatherLocation = "lon=" + position.coords.longitude + "&lat=" + position.coords.latitude;
        }
      );
    }else{
      weatherLocation = "q="+CITY;
    }
    temperatureUnit = "&units="+UNITS;
    apiKey = APIKEY;

    if (!apiKey){
      //console.log('missing api key');
      return false;
    }
    
    //console.log("weatherLocation: "+weatherLocation);
    //console.log("temperatureUnit: "+temperatureUnit);
    //console.log("apiKey: "+apiKey);
    // Send a command to the companion
    messaging.peerSocket.send({
      command: 'weather',
      location: weatherLocation,
      units: temperatureUnit,
      api: apiKey
    });
  }else{
    //console.log('companion not reachable');
  }
}


function applyWeather(data) {
  let wtemp = "";
  let whref = "";
  if (data.temperature){
     wtemp = util.roundUp(data.temperature)+"°";
  }
  if (icon = weatherIcons[data.id]){
    whref = "icons/weather/"+icon+".png";
    //check if nighttime for code > 800
    if (data.id > 799) {
      //console.log(data.id);
      let timestampNow = Math.round(+new Date()/1000);
      if (data.sunset < timestampNow || data.sunrise > timestampNow) {
        //console.log("its nighttime");
        if (data.id == 800){
          whref = "icons/weather/night-clear.png";
        }else if (data.id > 800) {
          whref = "icons/weather/night-cloud.png";
        }
      }
    }
  }
  
  weatherCallback({
    temp: wtemp,
    href: whref
  });
}


function readWeather() {
  // Listen for the onopen event
  messaging.peerSocket.onopen = function() {
    // Fetch weather when the connection opens
    fetchWeather();
  }

  // Listen for messages from the companion
  messaging.peerSocket.onmessage = function(evt) {
    if (evt.data) {
      applyWeather(evt.data);
    }
  }
  // Listen for the onerror event
  messaging.peerSocket.onerror = function(err) {
    // Handle any errors
    //console.log("Connection error: " + err.code + " - " + err.message);
  }
}

function setupEvents() {
  display.addEventListener("change", function() {
    if ((display.on) && ENABLED) {
      start();
    } else {
      stop();
    }
  });
}

function start() {
  if (!watchID) {
    fetchWeather();
    readWeather();
    //update weather once an hour
    //watchID = setInterval(readWeather, 60 * 1000 * 60);
  }
}

function stop() {
  if (watchID) {
    clearInterval(watchID);
    watchID = null;
  }
}
