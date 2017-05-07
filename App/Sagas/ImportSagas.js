import { call } from 'redux-saga/effects'
import XLSX from 'xlsx'
import RNFS from 'react-native-fs'
import { createCard, createLesson, createLessonGroup, reset } from '../Realm/realm'

const getSentence = (string) => string.split('\n')[0]
const getFullSentence = (string) => string.split('\n')[1]

function parseCards (worksheet) {
  console.log('Parsing cards, worksheet length: ', worksheet.length)
  let cards = []
  for (var i = 0; i < worksheet.length; i++) {
    var row = worksheet[i]
    if (!row.Original || !row.Translation || !row.Transliteration) {
      break
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

    console.log(sentence)
    const card = createCard(Number(row.Id), sentence, fullSentence, i, row.Note)
    cards.push(card)
  }

  worksheet.splice(0, i)
  console.log(cards.length + ' cards found')
  return cards
}

function parseLesson (worksheet) {
  if (!worksheet.length) return
  console.log('Parsing lesson, worksheet length: ', worksheet.length)
  const lessonNameFull = worksheet[0].Original
  const res = lessonNameFull.match(/Lesson (\d+): (.+)/)
  const id = res[1]
  const name = res[2]
  if (!id || !name) return

  let note
  if (worksheet[1].Original && !worksheet[1].Translation && !worksheet[1].Transliteration) {
    // Note is optional
    note = worksheet[1].Original
  }

  worksheet.splice(0, note ? 2 : 1)
  const cards = parseCards(worksheet)
  if (!cards.length) return
  return createLesson(Number(id), name, note, cards)
}

function parseLessons (worksheet) {
  let lessons = []
  let canContinue = true
  while (canContinue) {
    const lesson = parseLesson(worksheet)
    if (lesson) {
      lessons.push(lesson)
      canContinue = worksheet.length > 2
    } else {
      canContinue = false
    }
  }

  return lessons
}

function parseGroups (workbook) {
  reset()
  console.log(workbook)
  for (var i = 0; i < workbook.SheetNames.length; i++) {
    const name = workbook.SheetNames[i]
    if (name === 'Words') return
    let worksheet = workbook.Sheets[name]
    let worksheetJSON = XLSX.utils.sheet_to_json(worksheet)
    console.log(worksheetJSON)

    const lessons = parseLessons(worksheetJSON)
    if (lessons.length) {
      createLessonGroup(name, lessons)
    }
  }
}

export function * importStart () {
  const data = yield call(RNFS.readFile, '/Users/christophe/Development/Projects/SleepoLingo/App/Lessons/lessons.xlsx',
    'base64')
  const workbook = yield call(XLSX.read, data)

  yield call(parseGroups, workbook)

  console.log('Done')
}
