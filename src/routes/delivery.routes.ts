import express from 'express';
import { upload } from '../middleware/upload';

const router = express.Router();
const deliveryController = require('../controllers/delivery.controller');

router.get('/', deliveryController.getAllDeliveries);
router.get('/:id', deliveryController.getDeliveryById);
router.get('/courier/:courierId', deliveryController.getDeliveriesByCourierId);
router.post('/', deliveryController.createDelivery);
router.put('/:id', deliveryController.updateDelivery);
router.put('/:id/deliver', upload.single('image'), deliveryController.updateDeliveryStatus);
router.delete('/:id', deliveryController.deleteDelivery);

export default router;
