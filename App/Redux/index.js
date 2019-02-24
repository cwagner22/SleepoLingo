import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import configureStore from "./CreateStore";
import rootSaga from "../Sagas/";
import ReduxPersist from "../Config/ReduxPersist";
import { alertReducer } from "redux-saga-rn-alert";

/* ------------- Assemble The Reducers ------------- */
export const reducers = combineReducers({
  lesson: require("./LessonRedux").reducer,
  playback: require("./PlaybackRedux").reducer,
  import: require("./ImportRedux").reducer,
  alertReducer
});

export default () => {
  let finalReducers = reducers;
  // If rehydration is on use persistReducer otherwise default combineReducers
  if (ReduxPersist.active) {
    const persistConfig = ReduxPersist.storeConfig;
    finalReducers = persistReducer(persistConfig, reducers);
  }

  let { store, sagasManager, sagaMiddleware, persistor } = configureStore(
    finalReducers,
    rootSaga
  );

  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require("./").reducers;
      store.replaceReducer(nextRootReducer);

      const newYieldedSagas = require("../Sagas").default;
      sagasManager.cancel();
      sagasManager.done.then(() => {
        sagasManager = sagaMiddleware.run(newYieldedSagas);
      });
    });
  }

  return { store, persistor };
};
