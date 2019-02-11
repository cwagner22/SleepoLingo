import { call, take } from "redux-saga/effects";
import XLSX from "xlsx";
import RNFS from "react-native-fs";
import Secrets from "react-native-config";

async function checkWords() {
  const sentences = await global.db.collections
    .get("sentences")
    .query()
    .fetch();
  const words = await global.db.collections
    .get("dictionary")
    .query()
    .fetch();

  const wordsMissing = sentences.reduce((res, sentence) => {
    // Check that every words of the sentence are included in the dictionary
    const sentenceWords = sentence.translation.split(" ");
    for (const word of sentenceWords) {
      const found = words.some(w => w.original === word);
      if (!found && !res.includes(word)) {
        res.push(word);
      }
    }
    return res;
  }, []);

  console.log("Words missing from dictionary:", wordsMissing);
}

const createWord = (original, translation, transliteration) =>
  global.db.collections.get("dictionary").prepareCreate(w => {
    w.original = original;
    w.translation = translation;
    w.transliteration = transliteration;
  });

function parseDictionary(worksheet, database) {
  console.log("Parsing Dictionary, worksheet length: ", worksheet.length);
  return worksheet.reduce((res, row) => {
    if (row.Original && row.Translation && row.Transliteration) {
      res.push(createWord(row.Original, row.Translation, row.Transliteration));
    }

    return res;
  }, []);
}

const getSentence = string => string.split("\n")[0];
const getFullSentence = string => string.split("\n")[1];

const createCard = (lesson, index, note, sentence, fullSentence) =>
  global.db.collections.get("cards").prepareCreate(card => {
    card.sentence.set(sentence);
    if (fullSentence) card.fullSentence.set(fullSentence);
    card.index = index;
    card.note = note;
    card.lesson.set(lesson);
  });

const createSentence = (original, translation, transliteration) =>
  global.db.collections.get("sentences").prepareCreate(s => {
    s.original = original;
    s.translation = translation;
    s.transliteration = transliteration;
    // s.card.set(newCard);
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

    const newSentence = createSentence(
      getSentence(row.Original),
      getSentence(row.Translation),
      getSentence(row.Transliteration)
    );

    // newCard.sentence.set(newSentence);

    // newCard.prepareUpdate(card => {
    //   card.sentence.set(newSentence);
    // });
    // cards.push(c);

    const newFullSentence = getFullSentence(row.Original)
      ? createSentence(
          getFullSentence(row.Original),
          getFullSentence(row.Translation),
          getFullSentence(row.Transliteration)
        )
      : null;

    sentences.push(newSentence);
    // recordsNormalized.cards.push(newCard);
    newFullSentence && sentences.push(newFullSentence);

    const newCard = createCard(
      lesson,
      i,
      row.Note,
      newSentence,
      newFullSentence
    );
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
    sentences = [],
    dictionary = [];

  for (var i = 0; i < workbook.SheetNames.length; i++) {
    const name = workbook.SheetNames[i];
    let worksheet = workbook.Sheets[name];
    let worksheetJSON = XLSX.utils.sheet_to_json(worksheet);

    if (name === "Dictionary") {
      // call(parseDictionary, worksheetJSON, database);
      dictionary = dictionary.concat(parseDictionary(worksheetJSON, database));
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

  const allRecords = [
    ...lessonGroups,
    ...lessons,
    ...cards,
    ...sentences,
    ...dictionary
  ];
  console.log(allRecords);
  await database.batch(...allRecords);

  await checkWords();
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
