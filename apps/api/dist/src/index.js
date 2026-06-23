import express from "express";
import "dotenv/config";
import boardRoutes from "./routes/boardRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import { db, populateDBWithDefaultData } from "./db/index.js";
import { boards } from "./db/schema.js";
const app = express();
const { PORT } = process.env;
app.use(express.json());
// Enable CORS for frontend local development if needed, but we will configure a Vite proxy
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});
app.use('/api/boards', boardRoutes);
app.use('/api/tasks', taskRoutes);
app.get('/', (req, res) => res.send('Landing page'));
// Auto-seed database if empty
async function initializeDatabase() {
    try {
        const existingBoards = await db.select().from(boards).limit(1);
        if (existingBoards.length === 0) {
            console.log("No boards found in database. Seeding default data...");
            await populateDBWithDefaultData();
            console.log("Database seeded successfully!");
        }
        else {
            console.log("Database already contains data. Skipping seed.");
        }
    }
    catch (error) {
        console.error("Failed to seed database on startup:", error);
    }
}
initializeDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});
//# sourceMappingURL=index.js.map