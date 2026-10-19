import type { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable("articles", {
    id: {
      type: "uuid",
      primaryKey: true,
      notNull: true,
      default: pgm.func("gen_random_uuid()"),
    },

    title: {
      type: "varchar(255)",
      notNull: true,
    },

    slug: {
      type: "varchar(255)",
      notNull: true,
      unique: true,
    },

    description: {
      type: "text",
      notNull: true,
    },

    content: {
      type: "text",
      notNull: true,
    },

    thumbnail_url: {
      type: "text",
      notNull: false,
    },

    category_id: {
      type: "uuid",
      notNull: true,
      references: "categories",
      onDelete: "RESTRICT",
    },

    author_id: {
      type: "uuid",
      notNull: true,
      references: "users",
      onDelete: "RESTRICT",
    },

    is_published: {
      type: "boolean",
      notNull: true,
      default: false,
    },

    published_at: {
      type: "timestamptz",
      notNull: false,
    },

    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },

    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.createIndex("articles", "category_id");
  pgm.createIndex("articles", "author_id");
  pgm.createIndex("articles", ["is_published", "published_at"]);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable("articles");
}
