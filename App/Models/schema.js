import { appSchema, tableSchema } from "@nozbe/watermelondb";

export const mySchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: "words",
      columns: [
        { name: "original", type: "string" },
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
      ]
    }),
    tableSchema({
      name: "cards",
      columns: [
        { name: "sentence_id", type: "string" },
        { name: "fullSentence_id", type: "string", isOptional: true },
        { name: "note", type: "string", isOptional: true },
        { name: "show_date", type: "string", isOptional: true }
      ]
    }),
    tableSchema({
      name: "lessons",
      columns: [
        { name: "name", type: "string" },
        { name: "note", type: "string", isOptional: true },
        { name: "lesson_group_id", type: "string" }
      ]
    }),
    tableSchema({
      name: "lesson_groups",
      columns: [{ name: "name", type: "string" }]
    })
  ]
});
