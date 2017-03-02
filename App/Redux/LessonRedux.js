import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  lessonStart: ['lesson']
})

export const LessonTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  lesson: null
})

/* ------------- Reducers ------------- */

// request the data from an api
export const startLesson = (state, { lesson }: Object) => {
  return state.merge({ lesson })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LESSON_START]: startLesson
})
