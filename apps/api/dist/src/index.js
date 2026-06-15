import express from "express";
import "dotenv/config";
import boardRoutes from "./routes/boardRoutes.js";
const app = express();
const { PORT } = process.env;
app.use('/', express.json());
app.use('/api/boards', boardRoutes);
app.get('/', (req, res) => res.send('Landing page'));
app.listen(PORT, () => { console.log(`Server is running on http://localhost:${PORT}`); });
//# sourceMappingURL=index.js.map