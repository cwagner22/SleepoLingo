import { call } from 'redux-saga/effects'
import XLSX from 'xlsx'
import RNFS from 'react-native-fs'
import realm from '../Realm/realm'

const getSentence = (string) => string.split('\n')[0]
const getFullSentence = (string) => string.split('\n')[1]

function parseCards (worksheet) {
  let cards = []
  for (var i = 0; i < worksheet.length; i++) {
    var row = worksheet[i]
    if (!row.Original || !row.Translation || !row.Transliteration) {
      return cards
    }

    const sentence = {
      original: getSentence(row.Original),
      translation: getSentence(row.Translation),
      transliteration: getSentence(row.Transliteration)
    }

    const fullSentence = {
      original: getFullSentence(row.Original),
      translation: getFullSentence(row.Translation),
      transliteration: getFullSentence(row.Transliteration)
    }

    let data = {
      image: 'test',
      sentence,
      // The order of Results is only guaranteed to stay consistent when the query is sorted. For performance
      // reasons, insertion order is not guaranteed to be preserved. So we use an index property to be sure.
      index: i,
      id: Number(row.Id)
    }

    if (row.Note) data.note = row.Note
    if (fullSentence.original && fullSentence.translation && fullSentence.transliteration) data.fullSentence = fullSentence

    cards.push(realm.create('Card', data, true))
  }

  return cards
}

function parseLesson (worksheet) {
  const lessonNameFull = worksheet[0].Original
  const name = lessonNameFull.substr(lessonNameFull.indexOf(':') + 1)
  const note = worksheet[1].Original

  const cards = parseCards(worksheet.slice(2))

  return realm.create('Lesson', {
    name,
    note,
    cards
  })
}

function parseLessons (workbook) {
  const worksheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[worksheetName]
  const worksheetJSON = XLSX.utils.sheet_to_json(worksheet)
  console.log(worksheetJSON)

  realm.write(() => {
    realm.deleteAll()

    const lesson = parseLesson(worksheetJSON)

    realm.create('LessonGroup', {
      name: worksheetName,
      lessons: [lesson]
    }, true)
  })
}

export function * importStart () {
  const data = yield call(RNFS.readFile, '/Users/christophe/Development/Projects/SleepoLingo/App/Lessons/lessons.xlsx',
    'base64')
  const workbook = yield call(XLSX.read, data)

  yield call(parseLessons, workbook)

  console.log('Done')
}
