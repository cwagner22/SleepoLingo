// Inspired from https://medium.com/farmdrop/using-normalizr-js-in-a-redux-store-96ab33991369

import { schema } from 'normalizr'

const cardSchema = new schema.Entity('cards')

const lessonSchema = new schema.Entity('lessons', {
  cards: [ cardSchema ]
})

const lessonGroupSchema = new schema.Entity('lessonGroups', {
  content: [ lessonSchema ]
}, {
  idAttribute: 'group'
})
const lessonsValuesSchema = new schema.Values(lessonGroupSchema)

export { lessonsValuesSchema, lessonGroupSchema, lessonSchema, cardSchema }
