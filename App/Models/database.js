import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";

import { mySchema } from "./schema";
import Card from "./Card";
import Lesson from "./Lesson";
import LessonGroup from "./LessonGroup";
import Dictionary from "./Dictionary";

const adapter = new SQLiteAdapter({
  // dbName: "SleepoLingo",
  schema: mySchema
});

export default new Database({
  adapter,
  modelClasses: [Card, Lesson, LessonGroup, Dictionary]
});
