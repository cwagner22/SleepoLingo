'use strict'

import Realm from 'realm'
import RNFS from 'react-native-fs'
import _ from 'lodash'
import moment from 'moment'

class Word extends Realm.Object {}
Word.schema = {
  name: 'Word',
  primaryKey: 'original',
  properties: {
    original: {type: 'string', indexed: true},
    translation: 'string',
    transliteration: 'string'
  }
}

export const createWord = (original, transliteration, translation) => {
  let data = { original, transliteration, translation }
  realm.write(() => {
    realm.create('Word', data)
  })
}

class Sentence extends Realm.Object {}
// Sentence.schema = {
//   name: 'Sentence',Q
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
    showDate: {type: 'date', optional: true},
    index: 'int'
  }
}

export const createCard = (id, sentence, fullSentence, index, note) => {
  let data = {
    sentence,
    // The order of Results is only guaranteed to stay consistent when the query is sorted. For performance
    // reasons, insertion order is not guaranteed to be preserved. So we use an index property to be sure.
    index,
    id
  }

  if (note) data.note = note
  if (fullSentence.original && fullSentence.translation && fullSentence.transliteration) {
    data.fullSentence = fullSentence
  }

  let res
  realm.write(() => {
    res = realm.create('Card', data, true)
  })
  return res
}

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

export const setDate = (card, date) => {
  if (moment.isMoment(date)) {
    date = date.toDate()
  }

  realm.write(() => {
    try {
      realm.create('Card', {id: card.id, showDate: date}, true)
      // card.showDate = date
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

export const ImmutableRealm = (func, option = {}) => {
  const defaultCopy = (item) => JSON.parse(JSON.stringify(item))
  const copy = option.copy || defaultCopy // Use deep copy.
  const success = option.success || true
  const fail = option.fail || false

  const defualtErrorHandler = (e) => e
  const errorHandler = option.errorHandler || defualtErrorHandler
  return (props) => new Promise((resolve, reject) => {
    try {
      const result = func(props, realm) || 'Return is null'
      const copiedResult = copy(result)
      resolve({status: success, data: copiedResult})
    } catch (e) {
      const error = errorHandler(e)
      reject({status: fail, error})
    }
  })
}

export const sortCards = (cards, allowAlmost = false) => {
  var sortedCardsReady = _.sortBy(cards, ['showDate', 'index'])
    .filter((card) => {
      // Exclude future cards
      return isReady(card, allowAlmost)
    })

  if (!sortedCardsReady.length && !allowAlmost) {
    return sortCards(cards, true)
  } else {
    return sortedCardsReady
  }
}

export const getNextCard = ({id}) => {
  const lesson = getLesson(id)
  const cards = sortCards(lesson.cards)
  const currentCard = cards.length ? cards[0] : null
  return currentCard
}

export const getCards = (lessonId) => {
  const lesson = getLesson(lessonId)
  return lesson.cards
}

class Lesson extends Realm.Object {}
Lesson.schema = {
  name: 'Lesson',
  primaryKey: 'id',
  properties: {
    id: 'int',
    name: 'string',
    note: {type: 'string', optional: true},
    cards: {type: 'list', objectType: 'Card'}
  }
}

export const getLesson = (id) => {
  // todo: ImmutableRealm?
  return realm.objectForPrimaryKey('Lesson', id)
}

export const createLesson = (id, name, note, cards) => {
  let data = {
    id,
    name,
    cards
  }

  if (note) {
    data.note = note
  }

  let res
  realm.write(() => {
    res = realm.create('Lesson', data, true)
  })
  return res
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

export const createLessonGroup = (name, lessons) => {
  let data = {
    name,
    lessons
  }

  let res
  realm.write(() => {
    res = realm.create('LessonGroup', data, true)
  })
  return res
}

export const reset = () => {
  realm.write(() => {
    realm.deleteAll()
  })
}

console.log('Realm.defaultPath', Realm.defaultPath)
console.log('MainBundlePath', RNFS.MainBundlePath)
console.log('CachesDirectoryPath', RNFS.CachesDirectoryPath)
// Bundle path: for readonly? Put seed in ios folder
// Doc folder: to edit
const realm = new Realm({
  // path: RNFS.MainBundlePath + '/realm.realm',
  path: 'db.realm',
  // path: '/Users/christophe/Development/Projects/SleepoLingo/App/Realm/db.realm',
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
// console.log(realm.path);
// export default realm
