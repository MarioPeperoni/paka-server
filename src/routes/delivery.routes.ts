import express from 'express';

import { upload } from '../middleware/upload';
import { courierAuth, adminAuth } from '../middleware/authMiddleware';

const router = express.Router();
const deliveryController = require('../controllers/delivery.controller');

router.get('/', adminAuth, deliveryController.getAllDeliveries);
router.get('/courier', courierAuth, deliveryController.getCourierDeliveries);
router.get('/id/:id', adminAuth, deliveryController.getDeliveryById);
router.post('/', adminAuth, deliveryController.createDelivery);
router.put('/:id', adminAuth, deliveryController.updateDelivery);
router.put(
  '/:id/deliver',
  courierAuth,
  upload.single('image'),
  deliveryController.updateDeliveryStatus
);
router.delete('/:id', adminAuth, deliveryController.deleteDelivery);

export default router;
