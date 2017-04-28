'use strict'

import Realm from 'realm'
// import RNFS from 'react-native-fs'

class Todo extends Realm.Object {}
Todo.schema = {
  name: 'Todo',
  properties: {
    done: {type: 'bool', default: false},
    text: 'string'
  }
}

class TodoList extends Realm.Object {}
TodoList.schema = {
  name: 'TodoList',
  properties: {
    name: 'string',
    creationDate: 'date',
    items: {type: 'list', objectType: 'Todo'}
  }
}

class Word extends Realm.Object {}
Word.schema = {
  name: 'Word',
  primaryKey: 'val',
  properties: {
    val: 'string'
  }
}

class Sentence extends Realm.Object {}
Sentence.schema = {
  name: 'Sentence',
  properties: {
    // List of Strings not possible yet
    words: {type: 'list', objectType: 'Word'}
  }
}

class Card extends Realm.Object {}
Card.schema = {
  name: 'Card',
  properties: {
    sentence: {type: 'Sentence'},
    full: {type: 'Sentence', optional: true}
  }
}

// console.log(RNFS.MainBundlePath, Realm.defaultPath)
export default new Realm({
  // path: RNFS.MainBundlePath + '/realm.realm',
  // path: '/App/Realm/db.realm',
  path: '/Users/christophe/Development/Projects/SleepoLingo4/App/Realm/db.realm',
  schema: [Word, Sentence, Card],
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
})
