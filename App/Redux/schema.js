// Inspired from https://medium.com/farmdrop/using-normalizr-js-in-a-redux-store-96ab33991369

import { schema } from 'normalizr'

const wordSchema = new schema.Entity('words')

const lessonSchema = new schema.Entity('lesson', {
  words: [ wordSchema ]
})

const lessonGroupSchema = new schema.Entity('lessonGroup', {
  content: [ lessonSchema ]
}, {
  idAttribute: 'group'
})
const lessonsValuesSchema = new schema.Values(lessonGroupSchema)

export { lessonsValuesSchema, lessonGroupSchema, lessonSchema, wordSchema }
