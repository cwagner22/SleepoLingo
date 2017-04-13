// @flow

import _ from 'lodash'
import moment from 'moment'

export default class WordHelper {
  constructor (store) {
    this.store = store
    this.currentWord = store.words[store.currentWordId]
  }

  isReady (word, allowAlmost) {
    word = this.wordWithDate(word)
    var dateCompare = moment()
    if (allowAlmost) {
      dateCompare.add(1, 'm')
    }
    return !word.showDate || moment(word.showDate).isBefore(dateCompare)
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
