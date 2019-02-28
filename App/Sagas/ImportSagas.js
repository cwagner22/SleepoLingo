import { call, put, select } from "redux-saga/effects";
import XLSX from "xlsx";
import RNFS from "react-native-fs";
import ImportActions from "../Redux/ImportRedux";
import database from "../Models/database";
import Debug from "debug";
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

const getCardPropertiesFromRow = row => ({
  note: row.Note,
  sentenceOriginal: getSentence(row.Original),
  sentenceTranslation: getSentence(row.Translation),
  sentenceTransliteration: getSentence(row.Transliteration),
  fullSentenceOriginal: getFullSentence(row.Original),
  fullSentenceTranslation: getFullSentence(row.Translation),
  fullSentenceTransliteration: getFullSentence(row.Transliteration)
});

function parseCards(worksheet, lesson) {
  debug("Parsing cards, worksheet length: ", worksheet.length);
  let cards = [];
  for (var i = 0; i < worksheet.length; i++) {
    var row = worksheet[i];
    if (!row.Original || !row.Translation || !row.Transliteration) {
      break;
    }

    const newCard = createCard(
      getCardPropertiesFromRow(row),
      lesson,
      i,
      row.Id
    );
    cards.push(newCard);
  }

  worksheet.splice(0, i);
  debug(cards.length + " cards found");
  return cards;
}

function parseLesson(worksheet, lessonGroup, index) {
  if (!worksheet.length) return;
  debug("Parsing lesson, worksheet length: ", worksheet.length);
  const lessonNameFull = worksheet[0].Original;
  const res = lessonNameFull.match(/Lesson (\d+): (.+)/);
  const id = res[1];
  const name = res[2];
  if (!id || !name) return;

  debug(`Lesson: ${name}`);

  let note;
  if (
    worksheet[1].Original &&
    !worksheet[1].Translation &&
    !worksheet[1].Transliteration
  ) {
    // Note is optional
    note = worksheet[1].Original;
  }

  worksheet.splice(0, note ? 2 : 1);

  const lesson = database.collections.get("lessons").prepareCreate(l => {
    l._raw.id = index.toString();
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
    if (lesson && _cards.length) {
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

function* importLessons(workbook) {
  yield database.unsafeResetDatabase();

  debug(workbook);
  const { lessonGroups, lessons, cards, dictionary } = parseGroups(workbook);

  const allRecords = [...lessonGroups, ...lessons, ...cards, ...dictionary];
  debug(allRecords);
  yield database.batch(...allRecords);

  yield checkWords();
}

const lessonsPath = RNFS.MainBundlePath + "/lessons.xlsx";

function* startImport(lessonsHash) {
  debug(`Loading ${lessonsPath}`);
  const data = yield call(RNFS.readFile, lessonsPath, "base64");
  const workbook = yield call(XLSX.read, data);

  yield call(importLessons, workbook);
  yield put(ImportActions.setLessonsHash(lessonsHash));
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
