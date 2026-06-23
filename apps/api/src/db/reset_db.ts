import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { boards, columns, tasks, boardMembers } from './schema.js';
import { populateDBWithDefaultData } from './index.js';

const pool = new pg.Pool({ connectionString: "postgresql://postgres:150420@localhost:5432/sela_db" });
const db = drizzle(pool);

async function resetDB() {
  try {
    console.log("Cleaning database tasks, columns, and boards...");
    await db.delete(tasks);
    await db.delete(columns);
    await db.delete(boardMembers);
    await db.delete(boards);
    
    console.log("Database cleaned. Re-seeding with fresh default data...");
    await populateDBWithDefaultData();
    console.log("Database reset and seeded successfully!");
  } catch (err) {
    console.error("Error resetting database:", err);
  } finally {
    await pool.end();
  }
}

resetDB();
