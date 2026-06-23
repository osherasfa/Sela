import express from 'express';
import { getBoard, getBoards } from "../controllers/boardController.js";
const router = express.Router();
router.get('/', getBoards);
router.get('/:boardId', getBoard);
export default router;
//# sourceMappingURL=boardRoutes.js.map