import { config } from "dotenv";
config({ path: "../../.env" })
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from "pg";
import { users, boards, columns, tasks } from "./schema.js";

console.log("Hmm..", process.env.DATABASE_URL)
const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle(pool);

async function populateDBWithDefaultData() {
    /* Populate User */
    const defaultUser: typeof users.$inferInsert = {
        email: 'osher@example.com',
        username: 'bowieteth',
        password: 'weakpassword',
    };
    const [dbUser] = await db.insert(users).values(defaultUser).onConflictDoNothing({ target: [users.email, users.username] }).returning();
    console.log(dbUser);

    /* Populate Board */
    const defaultBoard: typeof boards.$inferInsert = {
        ownerId: dbUser.id,
        title: "Default BoardTitle",
    };
    const [dbBoard] = await db.insert(boards).values(defaultBoard).onConflictDoNothing({ target: boards.title }).returning();
    console.log(dbBoard);

    /* Populate Columns */
    const defaultColumns: typeof columns.$inferInsert[] = ["To Do", "In Progress", "Testing", "Done"].map((title, index) => ({
        boardId: dbBoard.id,
        title,
        position: String(index + 1)
    }));

    const [dbColumns] = await db.insert(columns).values(defaultColumns).onConflictDoNothing({ target: columns.title }).returning();
    console.log(dbColumns);

    /* Populate Tasks */
    const defaultTasks: typeof tasks.$inferInsert[] = ["Task 1", "Task 2", "Task 3", "Task 4"].map((title, index) => ({
        columnId: dbColumns.id,
        title,
        description: `${title} Description`,
        position: String(index + 1)
    }));
    const [dbTasks] = await db.insert(tasks).values(defaultTasks).onConflictDoNothing({ target: tasks.title }).returning();
    console.log(dbTasks);
}

async function main() {
    await populateDBWithDefaultData();
}

main();
