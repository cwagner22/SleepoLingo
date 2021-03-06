import Config from "../Config/DebugConfig";
import Immutable from "seamless-immutable";
import Reactotron from "reactotron-react-native";
import { reactotronRedux as reduxPlugin } from "reactotron-redux";
import sagaPlugin from "reactotron-redux-saga";

console.disableYellowBox = true;

// To show network call in devtools
GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;

if (Config.useReactotron) {
  // https://github.com/infinitered/reactotron for more options!
  Reactotron.configure({ name: "SleepoLingo" })
    .useReactNative()
    // .use(
    //   reduxPlugin({
    //     onRestore: Immutable,
    //     except: ["LOAD_LESSON", "DOWNLOAD_LESSON"]
    //   })
    // )
    // .use(sagaPlugin())
    .connect();

  // Let's clear Reactotron on every time we load the app
  Reactotron.clear();

  // Totally hacky, but this allows you to not both importing reactotron-react-native
  // on every file.  This is just DEV mode, so no big deal.
  console.tron = Reactotron;
}
