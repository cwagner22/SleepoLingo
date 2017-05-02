// @flow

import _ from 'lodash'
import moment from 'moment'

export default class CardHelper {
  constructor (store) {
    this.store = store
    this.currentCard = store.cards[store.currentCardId]
  }

  isReady (card, allowAlmost) {
    card = this.cardWithDate(card)
    var dateCompare = moment()
    if (allowAlmost) {
      dateCompare.add(1, 'm')
    }
    return !card.showDate || moment(card.showDate).isBefore(dateCompare)
  }

  cardWithDate (card) {
    if (!_.isObject(card)) {
      card = this.store.cards[card]
    }

    return {
      ...card,
      showDate: this.store.cardsDates[card.id]
    }
  }

  // currentCards () {
  //   return this.currentLesson.words.map(wId => this.store.words[wId])
  // }
}
