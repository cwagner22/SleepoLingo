import { combineReducers } from "redux";
import lessons from "./lessons";
import navigation from "./navigation";

export default combineReducers({ nav: navigation, lessons });
