import { config } from "dotenv";
config({ path: "../../.env" })
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from "pg";
import { eq } from "drizzle-orm";
import { users, boards, columns, tasks } from "./schema.js";

console.log("Hmm..", process.env.DATABASE_URL);
const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle(pool);

async function populateDBWithDefaultData() {
    /* Populate User */
    const defaultUser: typeof users.$inferInsert = {
        email: 'osher@example.com',
        username: 'bowieteth',
        password: 'weakpassword',
    };
    let dbUser = (await db.insert(users).values(defaultUser).onConflictDoNothing({ target: users.email }).returning())[0];
    if (!dbUser)
        dbUser = (await db.select().from(users).where(eq(users.email, defaultUser.email)))[0];
    console.log("User:", dbUser);

    /* Populate Board */
    const defaultBoard: typeof boards.$inferInsert = {
        ownerId: dbUser.id,
        title: "Default BoardTitle",
    };
    let dbBoard = (await db.insert(boards).values(defaultBoard).onConflictDoNothing({ target: boards.title }).returning())[0];
    if (!dbBoard)
        dbBoard = (await db.select().from(boards).where(eq(boards.title, defaultBoard.title)))[0];
    console.log("Board:", dbBoard);

    /* Populate Columns */
    const columnTitles = ["To Do", "In Progress", "Testing", "Done"];
    const dbColumns: (typeof columns.$inferSelect)[] = [];

    for (let i = 0; i < columnTitles.length; i++) {
        const title = columnTitles[i];
        const columnData: typeof columns.$inferInsert = {
            boardId: dbBoard.id,
            title,
            position: String(i + 1),
        };
        let dbCol = (await db.insert(columns).values(columnData).onConflictDoNothing({ target: columns.title }).returning())[0];
        if (!dbCol)
            dbCol = (await db.select().from(columns).where(eq(columns.title, title)))[0];

        dbColumns.push(dbCol);
    }
    console.log("Columns:", dbColumns.map(c => c.title));

    /* Populate Tasks */
    for (const col of dbColumns) {
        console.log(`Populating tasks for column: ${col.title}`);
        for (let j = 0; j < 4; j++) {
            const taskTitle = `Task ${j + 1} - ${col.title}`;
            const taskData: typeof tasks.$inferInsert = {
                columnId: col.id,
                title: taskTitle,
                description: `${taskTitle} Description`,
                position: String(j + 1),
            };
            let dbTask = (await db.insert(tasks).values(taskData).onConflictDoNothing({ target: tasks.title }).returning())[0];
            if (!dbTask)
                dbTask = (await db.select().from(tasks).where(eq(tasks.title, taskTitle)))[0];
            
            console.log(` - ${dbTask.title}`);
        }
    }
}

// async function main() {
//     try {
//         await populateDBWithDefaultData();
//     } catch (error) {
//         console.error("Error during DB population:", error);
//     } finally {
//         await pool.end();
//     }
// }

// main();

export { db };