// 'use strict'
//
// import Realm from 'realm'
// import RNFS from 'react-native-fs'
// import moment from 'moment'
//
// export class Word {
//   static schema = {
//     name: 'Word',
//     primaryKey: 'original',
//     properties: {
//       original: {type: 'string', indexed: true},
//       translation: 'string',
//       transliteration: 'string'
//     }
//   }
//
//   static create (original, transliteration, translation) {
//     let data = {original, transliteration, translation}
//     realm.write(() => {
//       realm.create('Word', data)
//     })
//   }
//
//   static getWord (word) {
//     return realm.objects('Word').filtered(`original == "${word}"`)[0]
//   }
// }
//
// export class Sentence {
//   // Sentence.schema = {
//   //   name: 'Sentence',Q
//   //   // primaryKey: 'id',
//   //   properties: {
//   //     // id: 'int',
//   //     // List of Strings not possible yet
//   //     words: {type: 'list', objectType: 'Word'}
//   //   }
//   // }
//
//   static schema = {
//     name: 'Sentence',
//     // primaryKey: 'id',
//     properties: {
//       // id: 'int',
//       original: 'string',
//       translation: 'string',
//       transliteration: 'string'
//     }
//   }
// }
//
// export class Card {
//   static schema = {
//     name: 'Card',
//     primaryKey: 'id',
//     properties: {
//       id: 'int',
//       sentence: {type: 'Sentence'},
//       fullSentence: {type: 'Sentence', optional: true},
//       note: {type: 'string', optional: true},
//       // List of Strings not possible yet
//       // explanation: {type: 'list', objectType: 'Word', optional: true},
//       showDate: {type: 'date', optional: true},
//       index: 'int'
//     }
//   }
//
//   static create (id, sentence, fullSentence, index, note) {
//     let data = {
//       sentence,
//       // The order of Results is only guaranteed to stay consistent when the query is sorted. For performance
//       // reasons, insertion order is not guaranteed to be preserved. So we use an index property to be sure.
//       index,
//       id
//     }
//
//     if (note) data.note = note
//     if (fullSentence.original && fullSentence.translation && fullSentence.transliteration) {
//       data.fullSentence = fullSentence
//     }
//
//     let res
//     realm.write(() => {
//       res = realm.create('Card', data, true)
//     })
//     return res
//   }
//
//   isReady (showDates, allowAlmost) {
//     var dateCompare = moment()
//     if (allowAlmost) {
//       dateCompare.add(1, 'm')
//     }
//     const showDate = showDates[this.id]
//     return !showDate || moment(showDate).isBefore(dateCompare)
//   }
//
//   // setDate (date) {
//   //   if (moment.isMoment(date)) {
//   //     date = date.toDate()
//   //   }
//   //
//   //   realm.write(() => {
//   //     try {
//   //       // realm.create(Card.schema.name, {id: this.card.id, showDate: date}, true)
//   //       this.showDate = date
//   //     } catch (e) {
//   //       console.warn(e)
//   //     }
//   //   })
//   // }
// }
//
// export class Lesson {
//   static schema = {
//     name: 'Lesson',
//     primaryKey: 'id',
//     properties: {
//       id: 'int',
//       name: 'string',
//       note: {type: 'string', optional: true},
//       cards: {type: 'list', objectType: 'Card'}
//     }
//   }
//
//   static create (id, name, note, cards) {
//     let data = {
//       id,
//       name,
//       cards
//     }
//
//     if (note) {
//       data.note = note
//     }
//
//     let res
//     realm.write(() => {
//       res = realm.create(Lesson.schema.name, data, true)
//     })
//     return res
//   }
//
//   // sortCards (allowAlmost = false) {
//   //   var sortedCardsReady = _.sortBy(this.cards, ['showDate', 'index'])
//   //     .filter((card) => {
//   //       // Exclude future cards
//   //       return card.isReady(allowAlmost)
//   //     })
//   //
//   //   if (!sortedCardsReady.length && !allowAlmost) {
//   //     return this.sortCards(this.cards, true)
//   //   } else {
//   //     return sortedCardsReady
//   //   }
//   // }
//
//   // resetDates () {
//   //   realm.write(() => {
//   //     for (let card of this.cards) {
//   //       card.showDate = new Date()
//   //     }
//   //   })
//   // }
//
//   // getNextCard () {
//   //   const cards = this.sortCards(this.cards)
//   //   return cards[0]
//   // }
// }
//
// export class LessonGroup {
//   static schema = {
//     name: 'LessonGroup',
//     // primaryKey: 'id',
//     properties: {
//       // id: 'int',
//       name: 'string',
//       lessons: {type: 'list', objectType: 'Lesson'}
//     }
//   }
//
//   static create (name, lessons) {
//     let data = {
//       name,
//       lessons
//     }
//
//     let res
//     realm.write(() => {
//       res = realm.create(LessonGroup.schema.name, data, true)
//     })
//     return res
//   }
// }
//
// export const reset = () => {
//   realm.write(() => {
//     realm.deleteAll()
//   })
// }
//
// const schemas = [Word, Sentence, Card, Lesson, LessonGroup]
//
// schemas.forEach((ObjectType) => {
//   const schemaName = ObjectType.schema.name
//
//   ObjectType.get = () => {
//     return realm.objects(schemaName)
//   }
//
//   ObjectType.getFromId = (id) => {
//     return realm.objectForPrimaryKey(schemaName, id)
//   }
// })
//
// console.log('Realm.defaultPath', Realm.defaultPath)
// console.log('MainBundlePath', RNFS.MainBundlePath)
// console.log('CachesDirectoryPath', RNFS.CachesDirectoryPath)
// // Bundle path: for readonly? Put seed in ios folder
// // Doc folder: to edit
// const realm = new Realm({
//   path: RNFS.MainBundlePath + '/default.realm',
//   // path: 'default.realm',
//   // path: '/Users/christophe/Development/Projects/SleepoLingo/App/Realm/default.realm',
//   schema: schemas,
//   // migration: function(oldRealm, newRealm) {
//   //   // only apply this change if upgrading to schemaVersion 1
//   //   if (oldRealm.schemaVersion < 1) {
//   //     var oldObjects = oldRealm.objects('Person');
//   //     var newObjects = newRealm.objects('Person');
//   //
//   //     // loop through all objects and set the name property in the new schema
//   //     for (var i = 0; i < oldObjects.length; i++) {
//   //       newObjects[i].name = oldObjecs[i].firstName + ' ' + oldObjects[i].lastName;
//   //     }
//   //   }
//   // }
//   // Reading from bundle is read only, overwise we have to copy the db to Documents folder
//   readOnly: true,
//   schemaVersion: 1
// })
// console.log('Realm db path', realm.path)
// // export default realm
