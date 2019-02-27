import Debug from "debug";
Debug.enable("*");
import "./App/Config/ReactotronConfig";
import { AppRegistry } from "react-native";
import App from "./App/Containers/App";

// To show network call in devtools
GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;

console.disableYellowBox = true;
AppRegistry.registerComponent("SleepoLingo", () => App);
