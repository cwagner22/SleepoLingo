import { Database } from "@nozbe/watermelondb";
import { mySchema } from "../schema";
import Card from "../Card";
import Lesson from "../Lesson";
import LessonGroup from "../LessonGroup";
import Dictionary from "../Dictionary";
import LokiJSAdapter from "@nozbe/watermelondb/adapters/lokijs";

const adapter = new LokiJSAdapter({
  dbName: "SleepoLingo",
  schema: mySchema
});

export default new Database({
  adapter,
  modelClasses: [Card, Lesson, LessonGroup, Dictionary]
});
