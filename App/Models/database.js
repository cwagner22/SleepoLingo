import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";

import { mySchema } from "./schema";
import Card from "./Card";
import Lesson from "./Lesson";
import LessonGroup from "./LessonGroup";
import Dictionary from "./Dictionary";

let LokiJSAdapter;
if (global.__TESTT__) {
  // LokiJSAdapter = require("@nozbe/watermelondb/adapters/lokijs");
}

// import LokiJSAdapter from "@nozbe/watermelondb/adapters/lokijs";

const watermelonAdapter = global.__TEST__ ? LokiJSAdapter : SQLiteAdapter;

const adapter = new watermelonAdapter({
  dbName: "SleepoLingo",
  schema: mySchema
});

export default new Database({
  adapter,
  modelClasses: [Card, Lesson, LessonGroup, Dictionary]
});
