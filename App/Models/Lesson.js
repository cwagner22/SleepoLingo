import { Model } from "@nozbe/watermelondb";
import { field, relation, children } from "@nozbe/watermelondb/decorators";
import addMinutes from "date-fns/add_minutes";
import isBefore from "date-fns/is_before";

export default class Lesson extends Model {
  static table = "lessons";

  @field("note") note;
  @field("name") name;
  @field("is_completed") isCompleted;

  static associations = {
    posts: { type: "belongs_to", key: "lesson_group_id" },
    cards: { type: "has_many", foreignKey: "lesson_id" }
  };

  @relation("lesson_groups", "lesson_group_id") lessonGroup;
  @children("cards") cards;
}
