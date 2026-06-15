import express from 'express';
import { getBoard } from "../controllers/boardController.js";
const router = express.Router();
router.get('/:boardId', getBoard);
export default router;
//# sourceMappingURL=boardRoutes.js.map