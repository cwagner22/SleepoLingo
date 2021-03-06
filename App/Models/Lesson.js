import { Model } from "@nozbe/watermelondb";
import { field, relation, children } from "@nozbe/watermelondb/decorators";

export default class Lesson extends Model {
  static table = "lessons";

  @field("note") note;
  @field("name") name;
  @field("is_completed") isCompleted;
  @field("is_in_progress") isInProgress;

  static associations = {
    posts: { type: "belongs_to", key: "lesson_group_id" },
    cards: { type: "has_many", foreignKey: "lesson_id" }
  };

  @relation("lesson_groups", "lesson_group_id") lessonGroup;
  @children("cards") cards;
}
