// @flow

import Sound from "react-native-sound";
import Deferred from "../Lib/Deferred";

const loadSound = (path, volume = 1, speed = 0.7) => {
  var dfd = new Deferred(); // To resolve promise from outside scope
  var sound = null;
  // var _hasFinished = false

  sound = new Sound(path, "", error => {
    if (error) {
      console.error("failed to load the sound", error);
      return dfd.reject(error);
    }

    sound.setVolume(volume);

    play();

    // After play() because setSpeed was blocking the playback on physical android devices (dev only?)
    sound.setSpeed(speed);
  });

  const play = () => {
    sound.play(success => {
      if (success) {
        dfd.resolve();
      } else {
        dfd.reject();
      }
      // _hasFinished = true
      // Physical android devices: play() was retuning an error after some time (dev only?)
      sound.release();
    });
  };

  return {
    promise: dfd.promise,
    pause() {
      sound.pause();
    },
    resume() {
      play();
    },
    cancel() {
      // if (!_hasFinished) {
      //   dfd.reject({isCanceled: true})
      // }
      sound.stop();
    },
    setVolume(volume) {
      sound.setVolume(volume);
    },
    setSpeed(speed) {
      sound.setSpeed(speed);
    }
  };
};

export default loadSound;
