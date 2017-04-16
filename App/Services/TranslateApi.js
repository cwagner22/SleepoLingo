// a library to wrap and simplify api calls
import apisauce from 'apisauce'

// our "constructor"
// const create = (baseURL = 'https://translate.google.com/translate_a') => {
const create = (baseURL = 'https://clients5.google.com/translate_a') => {
  // const create = (baseURL = 'https://translation.googleapis.com/language/translate') => {
  // ------
  // STEP 1
  // ------
  //
  // Create and configure an apisauce-based api object.
  //
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

  // ------
  // STEP 2
  // ------
  //
  // Define some functions that call the api.  The goal is to provide
  // a thin wrapper of the api layer providing nicer feeling functions
  // rather than "get", "post" and friends.
  //
  // I generally don't like wrapping the output at this level because
  // sometimes specific actions need to be take on `403` or `401`, etc.
  //
  // Since we can't hide from that, we embrace it by getting out of the
  // way at this level.
  //
  // const translate = (word) => api.get('v2', {
  // const translate = (word) =>
  // api.get('single?client=gtx&ie=UTF-8&oe=UTF-8&dt=t&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&dt=at', {
  // // key: 'AIzaSyC8s0W6iWsIpSQ02ElMuhaNlEHH9mN_v_Y', // source: 'en', // target: 'th', // client: 'gtx', // ie:
  // 'UTF-8', // oe: 'UTF-8', sl: 'en', tl: 'th', q: word })

  const translate = (word) => api.get('t?client=dict-chrome-ex&tbb=1&ie=UTF-8&oe=UTF-8&hl=en', {
    // key: 'AIzaSyC8s0W6iWsIpSQ02ElMuhaNlEHH9mN_v_Y',
    // source: 'en',
    // target: 'th',
    // client: 'gtx',
    // ie: 'UTF-8',
    // oe: 'UTF-8',
    sl: 'en',
    tl: 'th',
    q: word
  })

  const translateWords = (words) => {
    let url = 't?client=dict-chrome-ex&tbb=1&ie=UTF-8&oe=UTF-8&hl=en'
    for (const word of words) {
      url = `${url}&q=${word}`
    }
    return api.get(url, {
      // key: 'AIzaSyC8s0W6iWsIpSQ02ElMuhaNlEHH9mN_v_Y',
      // source: 'en',
      // target: 'th',
      // client: 'gtx',
      // ie: 'UTF-8',
      // oe: 'UTF-8',
      sl: 'en',
      tl: 'th'
    })
  }

  //   .then((response) => {
  //   const content = eval(response.data)
  //   // content = eval(content);
  //
  //   var translated = {
  //     text:'',
  //     isCorrect:true,
  //     source:{
  //       synonyms:[],
  //       pronunciation:[],
  //       definitions:[],
  //       examples:[]
  //     },
  //     target:{
  //       synonyms:[]
  //     },
  //     translations:[]
  //   };
  //
  //   if (content[7] != null ){
  //     translated.isCorrect = false;
  //     translated.text = content[7][1];
  //   }else{
  //     translated.text = content[0][0][0];
  //
  //     //target synonyms
  //     if(content[1]!=null && content[1][0]!=null && content[1][0][1]!=null){
  //       if(content[1][0][1].length > 0){
  //         content[1][0][1].forEach(synonyms => {
  //           translated.target.synonyms.push(synonyms);
  //         });
  //       }
  //     }
  //
  //     //target translations
  //     if(content[1] !=null){
  //       content[1].forEach(translation => {
  //         var type = {
  //           type:translation[0],
  //           translations:[]
  //         }
  //         translation[2].forEach(translations => {
  //           type.translations.push([translations[0],translations[1]]);
  //         });
  //         translated.translations.push(type);
  //
  //       });
  //     }
  //
  //     //source synonyms
  //     if(content[11]!=null && content[11][0]!=null && content[11][0][1]!=null){
  //       if(content[11][0][1].length > 0){
  //         content[11][0][1].forEach(synonyms => {
  //           translated.source.synonyms.push(synonyms[0]);
  //         });
  //       }
  //     }
  //
  //     //pronunciation
  //     if(content[0][1]!=null){
  //       content[0][1].forEach(pronunciation => {
  //         if(pronunciation != null){
  //           translated.source.pronunciation.push(pronunciation);
  //         }
  //       });
  //     }
  //
  //     //definitions
  //     if(content[12]!=null){
  //
  //       content[12].forEach(definitions => {
  //         var define = {
  //           type:definitions[0],
  //           definitions:[]
  //         };
  //         definitions[1].forEach(one => {
  //           define.definitions.push({
  //             definition:one[0],
  //             example:one[2]
  //           });
  //         });
  //         translated.source.definitions.push(define);
  //
  //       });
  //     }
  //     //examples
  //     if(content[13]!=null && content[13][0]!=null){
  //       var TextWithoutTags = '';
  //       content[13][0].forEach(examples => {
  //         if(examples != null){
  //           TextWithoutTags = examples[0].replace(/(<([^>]+)>)/ig, "");
  //           translated.source.examples.push(TextWithoutTags);
  //         }
  //       });
  //     }
  //   }
  //
  //   console.log(translated);
  //
  // })

  const ttsURL = (word, language, rate) => {
    // return 'https://responsivevoice.org/responsivevoice/getvoice.php?t=' + encodeURIComponent(word) +
    //   '&tl=' + language + '&pitch=0.5&rate=' + rate + '&vol=1'
    return 'https://responsivevoice.org/responsivevoice/getvoice.php?t=' + encodeURIComponent(word) +
      '&tl=' + language
  }

  // ------
  // STEP 3
  // ------
  //
  // Return back a collection of functions that we would consider our
  // interface.  Most of the time it'll be just the list of all the
  // methods in step 2.
  //
  // Notice we're not returning back the `api` created in step 1?  That's
  // because it is scoped privately.  This is one way to create truly
  // private scoped goodies in JavaScript.
  //
  return {
    // a list of the API functions from step 2
    translate,
    translateWords,
    ttsURL
  }
}

// let's return back our create method as the default.
export default {
  create
}
