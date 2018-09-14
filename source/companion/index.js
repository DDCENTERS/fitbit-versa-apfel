// Import the messaging module
import * as messaging from "messaging";
import { settingsStorage } from "settings";

///////WEATHER
var URI = "https://api.openweathermap.org/data/2.5/weather"

// Fetch the weather from OpenWeather
function queryOpenWeather(location, units, apikey) {
  if (location == null){
    console.log('no location for weather found');
    return {}
  }
  
  if (apikey == ""){
    console.log('no api key for weather found');
    return {}
  }
  
  fetch(URI + "?" + location + units + "&APPID=" + apikey)
  .then(function (response) {
      response.json()
      .then(function(data) {
        if (data["main"]){
          // We just want the current temperature
          var weather = {
            temperature: data["main"]["temp"],
            id: data["weather"][0]["id"],
            sunset: data["sys"]["sunset"],
            sunrise: data["sys"]["sunrise"]
          }
          // Send the weather data to the device
          returnWeatherData(weather);
        }else if (data["cod"] == 401){
          console.log('invalid API key');
          return false;
        }else{
          console.log('invalid API response: '+data["cod"]+' - '+data["message"]);
          return false;
        }        
      });
  })
  .catch(function (err) {
    console.log('error fetching weather: ' + err);
  });
}

// Send the weather data to the device
function returnWeatherData(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send a command to the device
    messaging.peerSocket.send(data);
  } else {
    console.log("Error: Connection is not open");
  }
}

// Listen for messages from the device
messaging.peerSocket.onmessage = function(evt) {
  if (evt.data && evt.data.command == "weather") {
    // The device requested weather data
    queryOpenWeather(evt.data.location, evt.data.units, evt.data.api);
  }
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}


/////SETTINGS
settingsStorage.addEventListener("change", evt => {
  if (evt.oldValue !== evt.newValue) {
    sendValue(evt.key, evt.newValue);
  }
});
                                 
function sendValue(key, val) {
  if (val) {
    sendSettingData({
      key: key,
      value: JSON.parse(val)
    });
  }
}

function sendSettingData(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  } else {
    console.log("companion socket closed");
  }
}