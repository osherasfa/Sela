import express from "express";
import "dotenv/config";
import boardRoutes from "./routes/boardRoutes.js";
import cors from "cors";

const app = express();
const { PORT } = process.env;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use('/', express.json());
app.use('/api/boards', boardRoutes);

app.get('/', (req: any, res: any) => res.send('Landing page'));

app.listen(PORT, () => { console.log(`Server is running on http://localhost:${PORT}`); });