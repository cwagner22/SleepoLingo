global.__TEST__ = false;
import Debug from "debug";
Debug.enable("*");
import "./App/Config/ReactotronConfig";
import { AppRegistry } from "react-native";
import App from "./App/Containers/App";

AppRegistry.registerComponent("SleepoLingo", () => App);
