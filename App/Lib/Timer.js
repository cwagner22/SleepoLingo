// @flow

import BackgroundTimer from 'react-native-background-timer'

function Timer (callback, delay) {
  var timerId = null
  var start = null
  var remaining = delay

  this.pause = function () {
    BackgroundTimer.clearTimeout(timerId)
    remaining -= new Date() - start
  }

  this.resume = function () {
    start = new Date()
    BackgroundTimer.clearTimeout(timerId)
    timerId = BackgroundTimer.setTimeout(callback, remaining)
  }

  this.cancel = function () {
    BackgroundTimer.clearTimeout(timerId)
  }

  this.resume()
}

export default Timer
