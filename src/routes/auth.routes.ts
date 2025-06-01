import express from 'express';
import { courierAuth } from '../middleware/authMiddleware';

const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/register', authController.registerCourier);
router.post('/login', authController.loginCourier);
router.get('/me', courierAuth, authController.getCurrentCourier);

export default router;
