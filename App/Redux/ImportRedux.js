import { createActions, createReducer } from "reduxsauce";
import Immutable from "seamless-immutable";

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  forceImportLessons: null,
  importLessonsIfNeeded: null,
  setLessonsHash: ["lessonsHash"],
  setIsImporting: ["isImporting"]
});

export const ImportTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  lessonsHash: null,
  isImporting: false
});

/* ------------- Reducers ------------- */

export const setLessonsHash = (state, { lessonsHash }) => {
  return state.merge({
    lessonsHash
  });
};

export const setIsImporting = (state, { isImporting }) => {
  return state.merge({
    isImporting
  });
};

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_LESSONS_HASH]: setLessonsHash,
  [Types.SET_IS_IMPORTING]: setIsImporting
});
