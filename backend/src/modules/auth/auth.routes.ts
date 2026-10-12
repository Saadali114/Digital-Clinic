import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, logout, getMe } from './auth.controller.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();

// Rate limiter for authentication endpoints against brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests',
    message: 'Too many authentication attempts. Please try again after 15 minutes.',
  },
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', logout);
router.get('/me', requireAuth, getMe);

export const authRoutes = router;
