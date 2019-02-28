import { createStore, applyMiddleware, compose } from "redux";
// import Rehydration from "../Services/Rehydration";
import { persistStore } from "redux-persist";
import ReduxPersist from "../Config/ReduxPersist";
import Config from "../Config/DebugConfig";
import createSagaMiddleware from "redux-saga";
// import { createReactNavigationReduxMiddleware } from "react-navigation-redux-helpers";
import Reactotron from "reactotron-react-native";

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

  /* ------------- Analytics Middleware ------------- */
  // middleware.push(ScreenTracking);

  /* ------------- Saga Middleware ------------- */

  // const sagaMonitor = Config.useReactotron
  //   ? Reactotron.createSagaMonitor()
  //   : null;
  const sagaMonitor = null;
  const sagaMiddleware = createSagaMiddleware({ sagaMonitor });
  middleware.push(sagaMiddleware);

  /* ------------- Assemble Middleware ------------- */

  enhancers.push(applyMiddleware(...middleware));

  // if (Config.useReactotron) {
  //   enhancers.push(Reactotron.createEnhancer());
  // }

  // Redux DevTools support
  const composeEnhancer =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const store = createStore(rootReducer, composeEnhancer(...enhancers));

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
