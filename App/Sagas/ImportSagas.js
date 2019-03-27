import { call, put, select, all } from "redux-saga/effects";
import XLSX from "xlsx";
import RNFS from "react-native-fs";
import ImportActions from "../Redux/ImportRedux";
import database from "../Models/database";
import Debug from "debug";
import { Q } from "@nozbe/watermelondb";

Debug.enable("app:ImportSagas");
const debug = Debug("app:ImportSagas");

async function checkWords() {
  const cards = await database.collections
    .get("cards")
    .query()
    .fetch();
  const words = await database.collections
    .get("dictionary")
    .query()
    .fetch();

  const wordsMissing = cards.reduce((res, card) => {
    // Check that every words of the sentence are included in the dictionary
    const sentenceWords = card.getSentence().translation.split(" ");
    for (const word of sentenceWords) {
      const found = words.some(w => w.original === word);
      if (!found && !res.includes(word)) {
        res.push(word);
      }
    }
    return res;
  }, []);

  debug("Words missing from dictionary:", wordsMissing);
}

const createWord = (original, translation, transliteration) =>
  database.collections.get("dictionary").prepareCreate(w => {
    w.original = original;
    w.translation = translation;
    w.transliteration = transliteration;
  });

function parseDictionary(worksheet, database) {
  debug("Parsing Dictionary, worksheet length: ", worksheet.length);
  return worksheet.reduce((res, row) => {
    if (row.Original && row.Translation && row.Transliteration) {
      res.push(createWord(row.Original, row.Translation, row.Transliteration));
    }

    return res;
  }, []);
}

const getSentence = string => string.split("\n")[0];
const getFullSentence = string => string.split("\n")[1];

const createCard = (properties, lesson, index, id) =>
  database.collections.get("cards").prepareCreate(card => {
    Object.assign(card, properties, {
      index
    });
    card._raw.id = id.toString();
    card.lesson.set(lesson);
  });

const getCardPropertiesFromRow = row => {
  const {
    Note: note,
    Translation: translation,
    Transliteration: transliteration
  } = row;

  // original can be 0
  const original =
    row.Original || row.Original === 0 ? row.Original.toString() : null;

  return {
    ...(note && { note }),
    ...(original && { sentenceOriginal: getSentence(original) }),
    ...(translation && { sentenceTranslation: getSentence(translation) }),
    ...(transliteration && {
      sentenceTransliteration: getSentence(transliteration)
    }),
    ...(original && { fullSentenceOriginal: getFullSentence(original) }),
    ...(translation && {
      fullSentenceTranslation: getFullSentence(translation)
    }),
    ...(transliteration && {
      fullSentenceTransliteration: getFullSentence(transliteration)
    })
  };
};

function parseCards(worksheet, lesson) {
  debug("Parsing cards, worksheet length: ", worksheet.length);
  let cards = [];
  for (var i = 0; i < worksheet.length; i++) {
    var row = worksheet[i];
    const properties = getCardPropertiesFromRow(row);
    if (
      !properties.sentenceOriginal ||
      !properties.sentenceTranslation ||
      !properties.sentenceTransliteration
    ) {
      break;
    }

    const newCard = createCard(properties, lesson, i, row.Id);
    cards.push(newCard);
  }

  // Remove parsed cards
  worksheet.splice(0, i);

  debug(cards.length + " cards found");
  return cards;
}

const getNote = row =>
  !row.Id && row.Original && !row.Translation && !row.Transliteration
    ? row.Original
    : null;

function parseLesson(worksheet, lessonGroup, index) {
  if (!worksheet.length) return;
  debug("Parsing lesson, worksheet length: ", worksheet.length);
  const lessonNameFull = worksheet[0].Original;
  const res = lessonNameFull.match(/Lesson (\d+): (.+)/);
  if (!res) return; // Not a lesson, ignore
  const lessonIndex = res[1];
  const name = res[2];
  if (!lessonIndex || !name) return; // Missing values

  debug(`Lesson: ${name}`);

  const id = worksheet[0].Id;

  // Note is optional
  const note = getNote(worksheet[1]);

  // Skip to cards
  worksheet.splice(0, note ? 2 : 1);

  const lesson = database.collections.get("lessons").prepareCreate(l => {
    l._raw.id = id.toString();
    l.index = index;
    l.name = name;
    l.note = note;
    l.lessonGroup.set(lessonGroup);
  });

  const cards = parseCards(worksheet, lesson);
  return { lesson, cards };
}

function parseLessons(worksheet, lessonGroup) {
  let lessons = [],
    cards = [];
  let canContinue = true;
  let index = 0;
  while (canContinue) {
    const { lesson, cards: _cards } =
      parseLesson(worksheet, lessonGroup, index) || {};
    index++;
    if (lesson) {
      lessons = lessons.concat(lesson);
      cards = cards.concat(_cards);
      canContinue = worksheet.length > 2;
    } else {
      canContinue = false;
    }
  }

  return { lessons, cards };
}

function parseGroups(workbook) {
  let lessonGroups = [],
    lessons = [],
    cards = [],
    dictionary = [];

  for (var i = 0; i < workbook.SheetNames.length; i++) {
    const name = workbook.SheetNames[i];
    let worksheet = workbook.Sheets[name];
    let worksheetJSON = XLSX.utils.sheet_to_json(worksheet);

    if (name === "Dictionary") {
      dictionary = dictionary.concat(parseDictionary(worksheetJSON));
    } else {
      const newLessonGroup = database.collections
        .get("lesson_groups")
        .prepareCreate(lessonGroup => {
          lessonGroup.name = name;
        });

      lessonGroups.push(newLessonGroup);

      const { lessons: _lessons, cards: _cards } = parseLessons(
        worksheetJSON,
        newLessonGroup
      );
      lessons = lessons.concat(_lessons);
      cards = cards.concat(_cards);
    }
  }

  return { lessonGroups, lessons, cards, dictionary };
}

const savedKeys = [
  {
    collectionName: "lessons",
    keys: [
      {
        keyCamel: "isCompleted",
        query: Q.where("is_completed", true)
      },
      {
        keyCamel: "isInProgress",
        query: Q.where("is_in_progress", true)
      }
    ]
  },
  {
    collectionName: "cards",
    keys: [
      {
        keyCamel: "showAt",
        query: Q.where("show_at", Q.notEq(null))
      }
    ]
  }
];

function* modifiedRecords(collectionName, allowedKeys) {
  let records = yield database.collections
    .get(collectionName)
    .query(Q.or(...allowedKeys.map(k => k.query)))
    .fetch();

  const keysCamel = allowedKeys.map(k => k.keyCamel);
  const filtered = records.map(r =>
    Object.assign({ id: r.id }, ...keysCamel.map(key => ({ [key]: r[key] })))
  );
  return filtered;
}

function* backupUserData() {
  let records = [];
  for (const k of savedKeys) {
    records.push({
      collectionName: k.collectionName,
      modifiedProperties: yield call(modifiedRecords, k.collectionName, k.keys)
    });
  }
  return records;
}

function* existingRecords(records, collectionName) {
  const recordsFound = yield database.collections
    .get(collectionName)
    .query(Q.where("id", Q.oneOf(records.map(l => l.id))))
    .fetch();

  return recordsFound;
}

function* restoreUserData(userData) {
  debug("userData", userData);

  let recordsFound = [];
  for (const data of userData) {
    if (data.modifiedProperties.length) {
      const existingRec = yield call(
        existingRecords,
        data.modifiedProperties,
        data.collectionName
      );

      recordsFound.push(...existingRec);
    }
  }
  // debug("recordsFound", recordsFound);

  if (recordsFound.length) {
    const allModifiedProperties = userData.reduce(
      (acc, curr) => acc.concat(curr.modifiedProperties),
      []
    );
    yield database.batch(
      ...recordsFound.map(r =>
        r.prepareUpdate(() => {
          const modifiedProps = allModifiedProperties.find(p => p.id === r.id);
          let { id, ...modifiedPropsWithoutId } = modifiedProps;
          debug("modifiedPropsWithoutId", modifiedPropsWithoutId);

          Object.assign(r, modifiedPropsWithoutId);
        })
      )
    );
  }
}

function* importLessons(workbook) {
  const userData = yield call(backupUserData);
  yield database.action(() => database.unsafeResetDatabase());

  // debug("workbook:", workbook);
  const { lessonGroups, lessons, cards, dictionary } = parseGroups(workbook);

  const allRecords = [...lessonGroups, ...lessons, ...cards, ...dictionary];

  // debug("records:", allRecords);
  yield database.batch(...allRecords);

  yield call(restoreUserData, userData);

  if (__DEV__) {
    yield checkWords();
  }
}

// todo: On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
const lessonsPath = !global.__TEST__
  ? RNFS.MainBundlePath + "/lessons.xlsx"
  : "lessons.test.xlsx";

function* startImport(lessonsHash) {
  yield put(ImportActions.setIsImporting(true));
  debug("lessonsPath:", lessonsPath);
  debug(`Loading ${lessonsPath}`);
  const data = yield call(RNFS.readFile, lessonsPath, "base64");
  const workbook = yield call(XLSX.read, data);

  yield call(importLessons, workbook);
  yield put(ImportActions.setLessonsHash(lessonsHash));
  yield put(ImportActions.setIsImporting(false));
  debug("Done");
}

export function* importLessonsIfNeeded() {
  const lessonsHash = yield RNFS.hash(lessonsPath, "md5");
  const lastHash = yield select(state => state.import.lessonsHash);

  if (lessonsHash !== lastHash) {
    yield call(startImport, lessonsHash);
  }
}

export function* forceImport() {
  const lessonsHash = yield RNFS.hash(lessonsPath, "md5");
  yield call(startImport, lessonsHash);
}
