import { Model } from "@nozbe/watermelondb";
import { field, relation } from "@nozbe/watermelondb/decorators";

export default class Lesson extends Model {
  static table = "lessons";

  @relation("lesson_groups", "lesson_group_id") lessonGroupId;
  @field("note") note;
  @field("name") name;
}
