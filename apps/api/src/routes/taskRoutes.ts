import express from 'express';
import { updateTask, createTask } from '../controllers/taskController.js';

const router = express.Router();

router.post('/', createTask);
router.patch('/:taskId', updateTask);

export default router;
