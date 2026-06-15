import { config } from "dotenv";
config({ path: "../../.env" })
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from "pg";
import { users, boards, columns, tasks } from "./schema.js";
import { eq } from 'drizzle-orm';

console.log("Hmm..", process.env.DATABASE_URL)
const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle(pool);

// async function main() {
//     const user: typeof users.$inferInsert = {
//         email: 'osher@example.com',
//         username: 'bowieteth',
//         password: 'weakpassword',
//     };

//     const result = await db.insert(users).values(user).onConflictDoNothing({ target: users.email }).returning();
//     if (result.length > 0)
//         console.log('New user created!')
//     else
//         console.log("User already exists!");

//     let allUsers = await db.select().from(users);
//     console.log('Getting all users from the database: ', allUsers)
// }

async function main() {
    const [ user ] = await db.select().from(users).where(eq(users.email, "osher@example.com"));
    if(!user) {
        console.log("No user found!")
        return;
    }

    const defaultBoard: typeof boards.$inferInsert = {
        ownerId: user.id,
        title: "Default BoardTitle",
    };
    const [ dbBoard ] = await db.insert(boards).values(defaultBoard).returning();
    console.log(dbBoard);

    const defaultColumns: typeof columns.$inferInsert[] = [
        {
            boardId: dbBoard.id,
            title: "To Do",
            position: "1"
        },
        {
            boardId: dbBoard.id,
            title: "In Progress",
            position: "2",
        },
        {
            boardId: dbBoard.id,
            title: "Testing",
            position: "3"
        },
        {
            boardId: dbBoard.id,
            title: "Done",
            position: "4",
        },
    ];
    
    result = await db.insert(boards).values(defaultBoard).returning();
    console.log(result);

    const defaultTasks: typeof tasks.$inferInsert = {
        columnId: defaultColumns.id,
        title: "Default TaskTitle",
        description: "Default TaskDescription",
        position: "1",
        xPos: 0,
        yPos: 0,
    };
    result = await db.insert(boards).values(defaultBoard).returning();
    console.log(result);

    
    // if (result.length > 0)
    //     console.log('New user created!')
    // else
    //     console.log("User already exists!");

    // let allUsers = await db.select().from(users);
    // console.log('Getting all users from the database: ', allUsers)
}

main();
