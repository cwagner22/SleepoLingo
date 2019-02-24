import { createActions, createReducer } from "reduxsauce";
import Immutable from "seamless-immutable";

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  forceImportLessons: null,
  importLessonsIfNeeded: null,
  setLessonsHash: ["lessonsHash"]
});

export const ImportTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  lessonsHash: null
});

/* ------------- Reducers ------------- */

export const setLessonsHash = (state, { lessonsHash }) => {
  return state.merge({
    lessonsHash
  });
};

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_LESSONS_HASH]: setLessonsHash
});
