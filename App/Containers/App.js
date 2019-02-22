import "../Config";
import DebugConfig from "../Config/DebugConfig";
import React, { Component } from "react";
import { Provider } from "react-redux";
import RootContainer from "./RootContainer";
import { PersistGate } from "redux-persist/integration/react";

// import RootContainer from "./RootContainer";
// import { store, persistor } from "../Redux";
import createStore from "../Redux";
const { store, persistor } = createStore();
// const store = createStore();

import DatabaseProvider from "@nozbe/watermelondb/DatabaseProvider";
import database from "../Models/database";

class App extends Component {
  render() {
    return (
      <DatabaseProvider database={database}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <RootContainer />
          </PersistGate>
        </Provider>
      </DatabaseProvider>
    );
  }
}

// allow reactotron overlay for fast design in dev mode
export default (DebugConfig.useReactotron ? console.tron.overlay(App) : App);
