import { call, take } from "redux-saga/effects";
import XLSX from "xlsx";
import RNFS from "react-native-fs";
import Secrets from "react-native-config";
import Card from "../Models/Card";

function checkWords(card) {
  let wordsMissing = [];
  const sentences = Sentence.get();
  for (const s of sentences) {
    // Check that every words are included in the dictionary
    const words = s.translation.split(" ");
    for (const word of words) {
      if (!Word.getWord(word) && !Word.getWordFromTranslation(word)) {
        const index = wordsMissing.indexOf(word);
        if (index !== -1) {
          // let data = wordsMissing[index]
          // data.sentences.push(s)
        } else {
          wordsMissing.push(word);
          // wordsMissing.push({
          //   word,
          //   sentences: [s]
          // })
        }
      }
    }
  }

  // console.log('Words missing from dictionary:', _.toArray(wordsMissing))
  console.log("Words missing from dictionary:", wordsMissing);
}

function* parseDictionary(worksheet, database) {
  console.log("Parsing Dictionary, worksheet length: ", worksheet.length);
  for (var i = 0; i < worksheet.length; i++) {
    var row = worksheet[i];
    if (!row.Original || !row.Translation || !row.Transliteration) {
      break;
    }

    Word.create(row.Original, row.Transliteration, row.Translation);
  }
}

const getSentence = string => string.split("\n")[0];
const getFullSentence = string => string.split("\n")[1];

const createCard = (lesson, index, note) =>
  global.db.collections.get("cards").prepareCreate(card => {
    // card.sentence.set(newSentence);
    // if (newFullSentence) card.fullSentence.set(newFullSentence);
    card.index = index;
    card.note = note;
    card.lesson.set(lesson);
  });

const createSentence = (newCard, original, translation, transliteration) =>
  global.db.collections.get("sentences").prepareCreate(s => {
    s.original = original;
    s.translation = translation;
    s.transliteration = transliteration;
    s.card.set(newCard);
  });

function parseCards(worksheet, lesson) {
  console.log("Parsing cards, worksheet length: ", worksheet.length);
  let cards = [],
    sentences = [];
  for (var i = 0; i < worksheet.length; i++) {
    var row = worksheet[i];
    if (!row.Original || !row.Translation || !row.Transliteration) {
      break;
    }

    const newCard = createCard(lesson, i, row.Note);

    sentences.push(
      createSentence(
        newCard,
        getSentence(row.Original),
        getSentence(row.Translation),
        getSentence(row.Transliteration)
      )
    );

    const newFullSentence = getFullSentence(row.Original)
      ? createSentence(
          newCard,
          getFullSentence(row.Original),
          getFullSentence(row.Translation),
          getFullSentence(row.Transliteration)
        )
      : null;

    // recordsNormalized.cards.push(newCard);
    newFullSentence && sentences.push(newFullSentence);
    cards.push(newCard);
  }

  worksheet.splice(0, i);
  console.log(cards.length + " cards found");
  // return cards;
  return {
    cards,
    sentences
  };
}

function parseLesson(worksheet, lessonGroup, database) {
  if (!worksheet.length) return;
  console.log("Parsing lesson, worksheet length: ", worksheet.length);
  const lessonNameFull = worksheet[0].Original;
  const res = lessonNameFull.match(/Lesson (\d+): (.+)/);
  const id = res[1];
  const name = res[2];
  if (!id || !name) return;

  console.log(`Lesson: ${name}`);

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
    l.name = name;
    l.note = note;
    l.lessonGroup.set(lessonGroup);
  });
  // recordsNormalized.lessons.push(lesson);

  const { cards, sentences } = parseCards(worksheet, lesson, database);
  // if (!cards.length) return;

  // return {
  //   lesson: newLesson,
  //   cards
  // };
  // return Lesson.create(Number(id), name, note, cards);
  return { lesson, cards, sentences };
}

function parseLessons(worksheet, lessonGroup, database) {
  let lessons = [],
    cards = [],
    sentences = [];
  let canContinue = true;
  while (canContinue) {
    // const a = parseLesson(worksheet, lessonGroup, database);
    // console.log(a);
    const { lesson, cards: _cards, sentences: _sentences } =
      parseLesson(worksheet, lessonGroup, database) || {};
    if (lesson && _cards.length) {
      lessons = lessons.concat(lesson);
      cards = cards.concat(_cards);
      sentences = sentences.concat(_sentences);
      canContinue = worksheet.length > 2;
    } else {
      canContinue = false;
    }
  }

  return { lessons, cards, sentences };
}

async function parseGroups(workbook, database) {
  await database.unsafeResetDatabase();

  console.log(workbook);
  let lessonGroups = [],
    lessons = [],
    cards = [],
    sentences = [];

  for (var i = 0; i < workbook.SheetNames.length; i++) {
    const name = workbook.SheetNames[i];
    let worksheet = workbook.Sheets[name];
    let worksheetJSON = XLSX.utils.sheet_to_json(worksheet);
    console.log(worksheetJSON);

    if (name === "Dictionary") {
      // call(parseDictionary, worksheetJSON, database);
    } else {
      const newLessonGroup = database.collections
        .get("lesson_groups")
        .prepareCreate(lessonGroup => {
          lessonGroup.name = name;
        });

      lessonGroups.push(newLessonGroup);

      const {
        lessons: _lessons,
        cards: _cards,
        sentences: _sentences
      } = parseLessons(worksheetJSON, newLessonGroup, database);
      lessons = lessons.concat(_lessons);
      cards = cards.concat(_cards);
      sentences = sentences.concat(_sentences);
      // if (lessons.length) {
      //   // LessonGroup.create(name, lessons);
      // }
    }
  }

  // console.log(cards);

  // const sentences = cards.map(c => c.sentence);
  // console.log(sentences);

  const allRecords = [...lessonGroups, ...lessons, ...cards, ...sentences];
  console.log(allRecords);
  await database.batch(...allRecords);

  // checkWords();
}

export function* startImport({ database }) {
  const data = yield call(
    RNFS.readFile,
    Secrets.REALM_PATH + "/lessons.xlsx",
    "base64"
  );
  const workbook = yield call(XLSX.read, data);
  // yield call(database.unsafeResetDatabase);

  yield call(parseGroups, workbook, database);
  // await parseGroups(workbook, database)

  // const dbPath = Secrets.REALM_PATH + "/default.realm";
  // // Overwrite original db
  // try {
  //   yield call(RNFS.unlink, dbPath);
  // } catch (e) {
  //   // file doesn't exist
  // }
  // yield call(RNFS.copyFile, RNFS.MainBundlePath + "/default.realm", dbPath);
  console.log("Done");
}

// export default {
//   startImport
// };
