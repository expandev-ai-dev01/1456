import { Router } from 'express';
import * as taskController from '@/api/v1/internal/task/controller';
import * as taskQuickController from '@/api/v1/internal/task-quick/controller';
import * as subtaskController from '@/api/v1/internal/subtask/controller';
import * as templateController from '@/api/v1/internal/template/controller';

const router = Router();

// Task routes
router.post('/task', taskController.postHandler);

// Quick task routes
router.post('/task-quick', taskQuickController.postHandler);

// Subtask routes
router.post('/subtask', subtaskController.postHandler);

// Template routes
router.get('/template', templateController.getHandler);
router.post('/template', templateController.postHandler);

export default router;
