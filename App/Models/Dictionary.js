import { Model, Q } from "@nozbe/watermelondb";
import {
  field,
  date,
  relation,
  action,
  lazy,
  children
} from "@nozbe/watermelondb/decorators";

export default class Dictionary extends Model {
  static table = "dictionary";

  @field("original") original;
  @field("translation") translation;
  @field("transliteration") transliteration;
}
