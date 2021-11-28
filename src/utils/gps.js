import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Geolocation from '@react-native-community/geolocation';

class GPS {
  constructor() {
    this.location = null;
    this.watchID = null;
    this.options = {
      enableHighAccuracy: true,
      timeout: 20000,
    };
  }

  requestPermission() {
    return new Promise((resolve, reject) => {
      RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
        interval: 10000,
        fastInterval: 5000,
      }).then(
        (data) => {
          // The user has accepted to enable the location services
          // data can be :
          //  - "already-enabled" if the location services has been already enabled
          //  - "enabled" if user has clicked on OK button in the popup
          resolve(data);
        },
        (error) => {
          // The user has not accepted to enable the location services or something went wrong during the process
          // "err" : { "code" : "ERR00|ERR01|ERR02|ERR03", "message" : "message"}
          // codes :
          //  - ERR00 : The user has clicked on Cancel button in the popup
          //  - ERR01 : If the Settings change are unavailable
          //  - ERR02 : If the popup has failed to open
          //  - ERR03 : Internal error
          reject(error);
        },
      );
    });
  }

  getCurrentPosition() {
    //Geolocation.getCurrentPosition(info => console.log(info));

    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          this.location = position;
          resolve(position);
        },
        (error) => {
          console.log(error);
          resolve(null);
        },
        this.options,
      );
    });
  }
}

export default new GPS();