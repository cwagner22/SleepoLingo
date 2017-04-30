import RNFS from 'react-native-fs'

import API from '../Services/TranslateApi'

const api = API.create()

const downloadAudioIfNeeded = (word, language) => {
  const path = RNFS.CachesDirectoryPath + '/' + word.id + '.mp3'
  const w = word.full ? word.full : word
  const url = api.ttsURL(w.translation, language)

  const promise = RNFS.exists(path)
    .then((exists) => {
      if (!exists) {
        // write the file
        return RNFS.downloadFile({
          fromUrl: url,
          toFile: path,
          background: true
          // progressDivider: 5,
          // progress: onProgress,
        }).promise.then((success) => {
          console.log('FILE WRITTEN!', url, path)
        })
      }
    })

  return promise
}

export function * downloadLesson (action) {
  const {currentWords} = action
  console.log(currentWords)

  var promises = []
  currentWords.forEach((w) => {
    promises.push(downloadAudioIfNeeded(w, 'th-TH'))
  })

  yield Promise.all(promises)

  // const { city } = action
  // // make the call to the api
  // const response = yield call(api.getCity, city)
  //
  // // success?
  // if (response.ok) {
  //   const kelvin = path(['data', 'main', 'temp_max'], response)
  //   const temperature = <convertFrom></convertFrom>Kelvin(kelvin)
  //   yield put(TemperatureActions.temperatureSuccess(temperature, 'bonus'))
  // } else {
  //   yield put(TemperatureActions.temperatureFailure())
  // }
}
