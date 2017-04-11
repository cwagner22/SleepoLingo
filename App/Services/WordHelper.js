// @flow

import _ from 'lodash'

export default class WordHelper {
  constructor (store) {
    this.store = store
    this.currentWord = store.words[store.currentWordId]
  }

  isReady (word) {
    word = this.wordWithDate(word)

    return !word.showDate || word.showDate < new Date()
    // return !word.showDate || word.showDate.isBefore(moment())
  }

  wordWithDate (word) {
    if (_.isNumber(word)) {
      word = this.store.words[word]
    }

    return {
      ...word,
      showDate: this.store.cardsDates[word.id]
    }
  }
}
