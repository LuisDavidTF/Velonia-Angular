import express from 'express';
import { cartController } from '../controllers/cartController.js';
import { verifyToken } from '../middleware/veryfyToken.js';

const router = express.Router();

router.get('/', verifyToken, cartController.getCart);
router.post('/add', verifyToken, cartController.addToCart);
router.post('/checkout', verifyToken, cartController.createCheckoutSession);
router.delete('/:cartItemId', verifyToken, cartController.removeCartItem);
router.delete('/clear/all', verifyToken, cartController.clearCart);


export default router;
