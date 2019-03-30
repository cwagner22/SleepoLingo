import { createActions, createReducer } from "reduxsauce";
import Immutable from "seamless-immutable";

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  addCopilotScreen: ["screen"]
});

export const ImportTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  copilotScreens: []
});

/* ------------- Reducers ------------- */

export const addCopilotScreen = (state, { screen }) => {
  return state.merge({
    copilotScreens: [...state.copilotScreens, screen]
  });
};

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.ADD_COPILOT_SCREEN]: addCopilotScreen
});
