import { createStore, applyMiddleware, compose } from "redux";
// import Rehydration from "../Services/Rehydration";
import { persistStore } from "redux-persist";
import ReduxPersist from "../Config/ReduxPersist";
import Config from "../Config/DebugConfig";
import createSagaMiddleware from "redux-saga";
// import { createReactNavigationReduxMiddleware } from "react-navigation-redux-helpers";

// creates the store
export default (rootReducer, rootSaga) => {
  /* ------------- Redux Configuration ------------- */

  const middleware = [];
  const enhancers = [];

  /* ------------- Navigation Middleware ------------ */
  // const navigationMiddleware = createReactNavigationReduxMiddleware(
  //   "root",
  //   state => state.nav
  // );
  // middleware.push(navigationMiddleware);

  /* ------------- Saga Middleware ------------- */

  const sagaMonitor = Config.useReactotron
    ? console.tron.createSagaMonitor()
    : null;
  const sagaMiddleware = createSagaMiddleware({ sagaMonitor });
  middleware.push(sagaMiddleware);

  /* ------------- Assemble Middleware ------------- */

  enhancers.push(applyMiddleware(...middleware));

  // if Reactotron is enabled, we'll create the store through Reactotron
  const createAppropriateStore = Config.useReactotron
    ? console.tron.createStore
    : createStore;

  // Redux DevTools support
  const composeEnhancer =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const store = createAppropriateStore(
    rootReducer,
    composeEnhancer(...enhancers)
  );

  // configure persistStore and check reducer version number
  // if (ReduxPersist.active) {
  //   Rehydration.updateReducers(store);
  // }

  const persistor = persistStore(store);

  // kick off root saga
  let sagasManager = sagaMiddleware.run(rootSaga);

  return {
    store,
    sagasManager,
    sagaMiddleware,
    persistor
  };
};
