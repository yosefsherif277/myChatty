import  express from 'express';
import { register, login, logout, checkAuth, updateProfile } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

router.put('/updateProfile', protectRoute, updateProfile);

router.get('/checkAuth', protectRoute, checkAuth);

export default router;