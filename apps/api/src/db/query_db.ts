import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { columns, tasks } from './schema.js';

const pool = new pg.Pool({ connectionString: "postgresql://postgres:150420@localhost:5432/sela_db" });
const db = drizzle(pool);

async function inspectDB() {
  try {
    const cols = await db.select().from(columns);
    console.log("COLUMNS:");
    cols.forEach(c => console.log(` - ID: ${c.id}, Title: ${c.title}, Position: ${c.position}`));

    const tsk = await db.select().from(tasks);
    console.log("\nTASKS:");
    tsk.forEach(t => console.log(` - ID: ${t.id}, ColumnId: ${t.columnId}, Title: ${t.title}`));
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

inspectDB();
