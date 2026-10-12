import { Router } from 'express';
import { getUserById } from './users.controller.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();

router.get('/:id', requireAuth, getUserById);

export const userRoutes = router;
