// a library to wrap and simplify api calls
import apisauce from 'apisauce'
import { stringify } from 'qs'

// our "constructor"
const create = (baseURL = 'https://api.microsofttranslator.com') => {
  const api = apisauce.create({
    // base URL is read from the "constructor"
    baseURL,
    // here are some default headers
    headers: {
      // 'Cache-Control': 'no-cache'
      'Accept': 'application/json;charset=utf-8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Content-Type': 'application/json'
    },
    // 10 second timeout...
    timeout: 10000
  })

  // Force OpenWeather API Key on all requests
  // api.addRequestTransform((request) => {
  //   request.params['APPID'] = '0e44183e8d1018fc92eb3307d885379c'
  // })

  // Wrap api's addMonitor to allow the calling code to attach
  // additional monitors in the future.  But only in __DEV__ and only
  // if we've attached Reactotron to console (it isn't during unit tests).
  if (__DEV__ && console.tron) {
    api.addMonitor(console.tron.apisauce)
  }

  const setToken = (response) => {
    api.setHeader('Authorization', 'Bearer ' + response.data)
    this.token = response.data
  }

  const issueToken = () => {
    return api.post('https://api.cognitive.microsoft.com/sts/v1.0/issueToken', {}, {
      headers: {'Ocp-Apim-Subscription-Key': '0217bbae2f8347cea20da4f500143acf'}
    }).then(setToken)
  }

  const translateArray = (array) => {
    const promise = this.token ? Promise.resolve() : issueToken()
    return promise.then(() => {
      const params = {
        texts: JSON.stringify(array),
        from: 'en',
        to: 'th',
        appid: ''
      }
      return api.post('/V2/Ajax.svc/TranslateArray?' + stringify(params))
    })
  }

  return {
    issueToken,
    translateArray
  }
}

// let's return back our create method as the default.
export default {
  create
}
