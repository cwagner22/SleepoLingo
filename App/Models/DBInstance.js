import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";

import { mySchema } from "../Models/schema";
import Sentence from "../Models/Sentence";
import Card from "../Models/Card";
import Lesson from "./Lesson";
import LessonGroup from "./LessonGroup";
import Dictionary from "./Dictionary";

let database;

export default {
  getCurrentDB() {
    if (!database) {
      const adapter = new SQLiteAdapter({
        dbName: "SleepoLingo",
        schema: mySchema
      });

      database = new Database({
        adapter,
        modelClasses: [Sentence, Card, Lesson, LessonGroup, Dictionary]
      });
      global.db = database;
    }

    return database;
  }
};
