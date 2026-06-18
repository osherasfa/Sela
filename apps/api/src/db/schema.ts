import {
  pgTable,
  unique,
  uuid,
  text,
  timestamp,
  numeric,
  integer,
  primaryKey,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique().notNull(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const boards = pgTable("boards", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").unique().notNull(),
  ownerId: uuid("owner_id").notNull().references(() => users.id),
  shareToken: text("share_token").unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const boardMembers = pgTable(
  "board_members",
  {
    boardId: uuid("board_id").notNull().references(() => boards.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    role: text("role").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.boardId, table.userId] }),
  ],
);

export const columns = pgTable("columns", {
  id: uuid("id").primaryKey().defaultRandom(),
  boardId: uuid("board_id").notNull().references(() => boards.id, { onDelete: "cascade" }),
  title: text("title").unique().notNull(),
  position: numeric("position").notNull(),
  xPos: integer("x_pos"),
  yPos: integer("y_pos"),
});

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  columnId: uuid("column_id").notNull().references(() => columns.id, { onDelete: "cascade" }),
  title: text("title").unique().notNull(),
  description: text("description"),
  position: numeric("position").notNull(),
  xPos: integer("x_pos"),
  yPos: integer("y_pos"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});