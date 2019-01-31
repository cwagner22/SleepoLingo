import { Model } from "@nozbe/watermelondb";
import { field, children } from "@nozbe/watermelondb/decorators";

export default class LessonGroup extends Model {
  static table = "lessonGroupd";

  @field("name") name;

  static associations = {
    lessons: { type: "has_many", foreignKey: "lesson_group_id" }
  };

  @children("lessons") lessons;
}
