import { CartDao } from '../dao/cartDao.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const cartDao = new CartDao();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const cartController = {
  async getCart(req, res) {
    try {
      const userId = req.user.id;
      console.log('Usuario autenticado con ID:', userId);
      const cartItems = await cartDao.getCartItems(userId);
      const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

      res.status(200).json({ cartItems, total });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to load cart' });
    }
  },

  async addToCart(req, res) {
    try {
      const userId = req.user.id;
      const { productId, size, color, quantity } = req.body;

      const [variant] = await cartDao.getProductVariant(productId, size, color);

      if (!variant) {
        return res.status(404).json({ error: 'Product variant not found' });
      }

      const variantId = variant.id;
      await cartDao.addToCart(userId, variantId, quantity);

      res.status(200).json({ message: 'Item added to cart successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to add item to cart' });
    }
  },

  async removeCartItem(req, res) {
    try {
      const userId = req.user.id;
      const { cartItemId } = req.params;

      const cartItem = await cartDao.findCartItemById(cartItemId);
      if (!cartItem) {
        return res.status(404).json({ error: 'Item not found in cart' });
      }

      if (cartItem.user_id !== userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      await cartDao.removeItem(cartItemId);
      res.status(200).json({ message: 'Item removed from cart' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to remove item from cart' });
    }
  },

  async createCheckoutSession(req, res) {
    try {
      const userId = req.user.id;
      const cartItems = await cartDao.getCartItems(userId);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: cartItems.map(item => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name
            },
            unit_amount: Math.round(item.price * 100)
          },
          quantity: item.quantity
        })),
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/checkout-cancel`
      });

      res.status(200).json({ id: session.id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create checkout session' });
    }
  },

  async clearCart(req, res) { 
  const userId = req.user.id;
  console.log(userId); // Verifica que se imprime correctamente

  try {
    await cartDao.clearCartByUserId(userId);
    res.status(200).json({ message: 'Carrito vaciado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al vaciar el carrito' });
  }
}

};
