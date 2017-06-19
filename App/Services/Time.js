function withLeadingZero (amount) {
  if (amount < 10) {
    return `0${amount}`
  } else {
    return `${amount}`
  }
}

export default {
  isISOStringDate: (val) => {
    const re = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/

    return (typeof val === 'string' && val.match(re))
  },

  formattedTime: (timeInMs) => {
    if (timeInMs < 0) return ''
    let timeInSeconds = Math.floor(timeInMs / 1000)
    let minutes = Math.floor(timeInSeconds / 60)
    let seconds = timeInSeconds - minutes * 60

    if (isNaN(timeInSeconds) || isNaN(minutes) || isNaN(seconds) || (minutes < 0 && seconds < 0)) {
      return (`0:00`)
    } else {
      return (`${withLeadingZero(minutes)}:${withLeadingZero(seconds.toFixed(0))}`)
    }
  }
}
