import { appSchema, tableSchema } from "@nozbe/watermelondb";

export const mySchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: "dictionary",
      columns: [
        { name: "original", type: "string", isIndexed: true },
        { name: "translation", type: "string" },
        { name: "transliteration", type: "string" }
      ]
    }),
    tableSchema({
      name: "sentences",
      columns: [
        { name: "original", type: "string" },
        { name: "translation", type: "string" },
        { name: "transliteration", type: "string" }
        // { name: "card_id", type: "string", isIndexed: true }
      ]
    }),
    tableSchema({
      name: "cards",
      columns: [
        { name: "sentence_id", type: "string" },
        { name: "full_sentence_id", type: "string", isOptional: true },
        { name: "note", type: "string" },
        { name: "index", type: "number" },
        { name: "last_shown_at", type: "number", isOptional: true },
        { name: "lesson_id", type: "string", isIndexed: true }
      ]
    }),
    tableSchema({
      name: "lessons",
      columns: [
        { name: "name", type: "string" },
        { name: "note", type: "string" },
        { name: "is_completed", type: "boolean" },
        { name: "lesson_group_id", type: "string", isIndexed: true }
      ]
    }),
    tableSchema({
      name: "lesson_groups",
      columns: [{ name: "name", type: "string" }]
    })
  ]
});
