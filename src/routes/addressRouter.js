// backend/routes/addressRoutes.js
import express from 'express';
import { getAddresses, getAddressById, createAddress, updateAddress, deleteAddress } from '../controllers/addressController.js';
import { protect } from '../middleware/authMiddleware.js';

const addressRouter = express.Router();

addressRouter.get('/', protect, getAddresses);
addressRouter.post('/', protect, createAddress);
addressRouter.get('/:id', protect, getAddressById);
addressRouter.put('/:id', protect, updateAddress);
addressRouter.delete('/:id', protect, deleteAddress);

export default addressRouter;
