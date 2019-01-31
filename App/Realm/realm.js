"use strict";

// Inspired from https://github.com/realm/realm-js/issues/141#issuecomment-299721505

import { Platform } from "react-native";
import RNFS from "react-native-fs";
import moment from "moment";

export class Word {
  static schema = {
    name: "Word",
    primaryKey: "original",
    properties: {
      original: { type: "string", indexed: true },
      translation: "string",
      transliteration: "string"
    }
  };

  static create(original, transliteration, translation) {
    let data = { original, transliteration, translation };
    return realm.create("Word", data);
  }

  static getWord(word) {
    return realm.objects("Word").filtered(`original == "${word}"`)[0];
  }

  static getWordFromTranslation(word) {
    return realm.objects("Word").filtered(`translation == "${word}"`)[0];
  }
}

export class Sentence {
  // Sentence.schema = {
  //   name: 'Sentence',Q
  //   // primaryKey: 'id',
  //   properties: {
  //     // id: 'int',
  //     // List of Strings not possible yet
  //     words: {type: 'list', objectType: 'Word'}
  //   }
  // }

  static schema = {
    name: "Sentence",
    // primaryKey: 'id',
    properties: {
      // id: 'int',
      original: "string",
      translation: "string",
      transliteration: "string"
    }
  };
}

export class Card {
  static schema = {
    name: "Card",
    primaryKey: "id",
    properties: {
      id: "int",
      sentence: { type: "Sentence" },
      fullSentence: { type: "Sentence", optional: true },
      note: { type: "string", optional: true },
      // List of Strings not possible yet
      // explanation: {type: 'list', objectType: 'Word', optional: true},
      showDate: { type: "date", optional: true },
      index: "int"
    }
  };

  static create(id, sentence, fullSentence, index, note) {
    let data = {
      sentence,
      // The order of Results is only guaranteed to stay consistent when the query is sorted. For performance
      // reasons, insertion order is not guaranteed to be preserved. So we use an index property to be sure.
      index,
      id
    };

    if (note) data.note = note;
    if (
      fullSentence.original &&
      fullSentence.translation &&
      fullSentence.transliteration
    ) {
      data.fullSentence = fullSentence;
    }

    return realm.create("Card", data, true);
  }

  isReady(showDates, allowAlmost) {
    var dateCompare = moment();
    if (allowAlmost) {
      dateCompare.add(1, "m");
    }
    const showDate = showDates[this.id];
    return !showDate || moment(showDate).isBefore(dateCompare);
  }

  getSentence() {
    return this.fullSentence || this.sentence;
  }
}

export class Lesson {
  static schema = {
    name: "Lesson",
    primaryKey: "id",
    properties: {
      id: "int",
      name: "string",
      note: { type: "string", optional: true },
      cards: { type: "list", objectType: "Card" }
    }
  };

  static create(id, name, note, cards) {
    let data = {
      id,
      name,
      cards
    };

    if (note) {
      data.note = note;
    }

    return realm.create(Lesson.schema.name, data, true);
  }

  // sortCards (allowAlmost = false) {
  //   var sortedCardsReady = _.sortBy(this.cards, ['showDate', 'index'])
  //     .filter((card) => {
  //       // Exclude future cards
  //       return card.isReady(allowAlmost)
  //     })
  //
  //   if (!sortedCardsReady.length && !allowAlmost) {
  //     return this.sortCards(this.cards, true)
  //   } else {
  //     return sortedCardsReady
  //   }
  // }

  // resetDates () {
  //   realm.write(() => {
  //     for (let card of this.cards) {
  //       card.showDate = new Date()
  //     }
  //   })
  // }

  // getNextCard () {
  //   const cards = this.sortCards(this.cards)
  //   return cards[0]
  // }
}

export class LessonGroup {
  static schema = {
    name: "LessonGroup",
    // primaryKey: 'id',
    properties: {
      // id: 'int',
      name: "string",
      lessons: { type: "list", objectType: "Lesson" }
    }
  };

  static create(name, lessons) {
    let data = {
      name,
      lessons
    };

    return realm.create(LessonGroup.schema.name, data, true);
  }
}

export const reset = () => {
  realm.deleteAll();
};

export const write = fn => {
  realm.write(() => {
    fn();
  });
};

const schemas = [Word, Sentence, Card, Lesson, LessonGroup];

schemas.forEach(ObjectType => {
  const schemaName = ObjectType.schema.name;

  ObjectType.get = () => {
    return realm.objects(schemaName);
  };

  ObjectType.getFromId = (id, cache: boolean) => {
    if (cache) {
      if (!ObjectType.currentObject || ObjectType.currentObject.id !== id) {
        // Cache object
        ObjectType.currentObject = realm.objectForPrimaryKey(schemaName, id);
      }
      return ObjectType.currentObject;
    } else {
      return realm.objectForPrimaryKey(schemaName, id);
    }
  };
});

console.log("Realm.defaultPath", Realm.defaultPath);
console.log("MainBundlePath", RNFS.MainBundlePath);
console.log("CachesDirectoryPath", RNFS.CachesDirectoryPath);
// Bundle path: for readonly? Put seed in ios folder
// Doc folder: to edit
const realm = new Realm({
  path:
    (Platform.OS === "ios" ? RNFS.MainBundlePath : RNFS.DocumentDirectoryPath) +
    "/default.realm",
  // path: 'default.realm',
  // path: '/Users/christophe/Development/Projects/SleepoLingo/App/Realm/default.realm',
  schema: schemas,
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
  // Reading from bundle is read only, overwise we have to copy the db to Documents folder
  readOnly: !__DEV__,
  schemaVersion: 1
});
console.log("Realm db path", realm.path);
// export default realm
