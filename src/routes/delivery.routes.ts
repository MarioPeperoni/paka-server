import express from 'express';

import { upload } from '../middleware/upload';
import { courierAuth, adminAuth } from '../middleware/authMiddleware';

const router = express.Router();
const deliveryController = require('../controllers/delivery.controller');
const parcelController = require('../controllers/parcel.controller');

router.get('/all', adminAuth, deliveryController.getAllDeliveries);
router.get('/', courierAuth, deliveryController.getCourierDeliveries);
router.get('/id/:id', adminAuth, deliveryController.getDeliveryById);
router.get('/:id/parcel', adminAuth, parcelController.getAllParcelsInDelivery);

router.post('/', adminAuth, deliveryController.createDelivery);
router.post('/:id/parcel', adminAuth, parcelController.addParcelToDelivery);

router.put('/:id', adminAuth, deliveryController.updateDelivery);
router.put(
  '/:id/deliver',
  courierAuth,
  upload.single('image'),
  deliveryController.updateDeliveryStatus
);
router.put('/:deliveryId/parcel/:parcelId', adminAuth, parcelController.editParcelInDelivery);

router.delete('/:id', adminAuth, deliveryController.deleteDelivery);
router.delete(
  '/:deliveryId/parcel/:parcelId',
  adminAuth,
  parcelController.removeParcelFromDelivery
);

export default router;
