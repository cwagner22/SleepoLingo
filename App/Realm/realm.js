'use strict'

import Realm from 'realm'
import RNFS from 'react-native-fs'
import _ from 'lodash'

// class Todo extends Realm.Object {}
// Todo.schema = {
//   name: 'Todo',
//   properties: {
//     done: {type: 'bool', default: false},
//     text: 'string'
//   }
// }
//
// class TodoList extends Realm.Object {}
// TodoList.schema = {
//   name: 'TodoList',
//   properties: {
//     name: 'string',
//     creationDate: 'date',
//     items: {type: 'list', objectType: 'Todo'}
//   }
// }

class Word extends Realm.Object {}
Word.schema = {
  name: 'Word',
  primaryKey: 'val',
  properties: {
    val: 'string'
  }
}

class Sentence extends Realm.Object {}
// Sentence.schema = {
//   name: 'Sentence',
//   // primaryKey: 'id',
//   properties: {
//     // id: 'int',
//     // List of Strings not possible yet
//     words: {type: 'list', objectType: 'Word'}
//   }
// }

Sentence.schema = {
  name: 'Sentence',
  // primaryKey: 'id',
  properties: {
    // id: 'int',
    // List of Strings not possible yet
    original: 'string',
    translation: 'string',
    transliteration: 'string'
  }
}

class Card extends Realm.Object {}
Card.schema = {
  name: 'Card',
  primaryKey: 'id',
  properties: {
    id: 'int',
    sentence: {type: 'Sentence'},
    fullSentence: {type: 'Sentence', optional: true},
    note: {type: 'string', optional: true},
    image: 'string',
    showDate: {type: 'date', optional: true},
    index: 'int'
  }
}

import moment from 'moment'
// Card.isReady = (allowAlmost) => {
//   // card = this.cardWithDate(card)
//   var dateCompare = moment()
//   if (allowAlmost) {
//     dateCompare.add(1, 'm')
//   }
//   return !this.showDate || moment(this.showDate).isBefore(dateCompare)
// }

export const resetDates = (cards) => {
  realm.write(() => {
    try {
      for (let card of cards) {
        card.showDate = new Date()
      }
    } catch (e) {
      console.warn(e)
    }
  })
}

export const isReady = (card, allowAlmost) => {
  // card = this.cardWithDate(card)
  var dateCompare = moment()
  if (allowAlmost) {
    dateCompare.add(1, 'm')
  }
  return !card.showDate || moment(card.showDate).isBefore(dateCompare)
}

export const sortCards = (cards, allowAlmost = false) => {
  // let cardsReady = cards.sorted(['showDate', 'index']).filter((card) => {
  //   // Exclude future cards
  //   return isReady(card, allowAlmost)
  // })

  var sortedCardsRady = _.sortBy(cards, ['showDate', 'index'])
    .filter((card) => {
      // Exclude future cards
      return isReady(card, allowAlmost)
    })

  if (!sortedCardsRady.length && !allowAlmost) {
    return sortCards(cards, true)
  } else {
    return sortedCardsRady
  }
  // const sortCards = (wordHelper, wordsWithDates, allowAlmost) => {
  //   // Sort by date and index
  //   var sortedWords = _.sortBy(wordsWithDates, ['showDate', (w, i) => i])
  //     .filter((word) => {
  //       // Exclude future cards
  //       return wordHelper.isReady(word, allowAlmost)
  //     })
  //
  //   if (sortedWords.length) {
  //     return sortedWords
  //   } else {
  //     return sortCards(wordHelper, wordsWithDates, true)
  //   }
  // }
}

class Lesson extends Realm.Object {}
Lesson.schema = {
  name: 'Lesson',
  // primaryKey: 'id',
  properties: {
    // id: 'int',
    name: 'string',
    note: 'string',
    cards: {type: 'list', objectType: 'Card'}
  }
}

class LessonGroup extends Realm.Object {}
LessonGroup.schema = {
  name: 'LessonGroup',
  // primaryKey: 'id',
  properties: {
    // id: 'int',
    name: 'string',
    lessons: {type: 'list', objectType: 'Lesson'}
  }
}

export const getLessonGroups = () => {
  return realm.objects('LessonGroup')
}

console.log(RNFS.MainBundlePath, Realm.defaultPath, RNFS.CachesDirectoryPath)
// Bundle path: for readonly? Put seed in ios folder
// Doc folder: to edit
const realm = new Realm({
  // path: RNFS.MainBundlePath + '/realm.realm',
  // path: '/App/Realm/db.realm',
  path: '/Users/christophe/Development/Projects/SleepoLingo/App/Realm/db.realm',
  schema: [Word, Sentence, Card, Lesson, LessonGroup],
  // migration: function(oldRealm, newRealm) {
  //   // only apply this change if upgrading to schemaVersion 1
  //   if (oldRealm.schemaVersion < 1) {
  //     var oldObjects = oldRealm.objects('Person');
  //     var newObjects = newRealm.objects('Person');
  //
  //     // loop through all objects and set the name property in the new schema
  //     for (var i = 0; i < oldObjects.length; i++) {
  //       newObjects[i].name = oldObjecs[i].firstName + ' ' + oldObjects[i].lastName;
  //     }
  //   }
  // }
  // readOnly: true
  schemaVersion: 1
})
export default realm
