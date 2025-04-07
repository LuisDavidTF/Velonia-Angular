import { UserDao } from '../dao/userDao.js';
import { ProductDao } from '../dao/productDao.js';
import bcrypt from 'bcryptjs';

const userDao = new UserDao();
const productDao = new ProductDao();

export const profileController = {
  async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const user = await userDao.findById(userId);
      const userProducts = await productDao.findByUser(userId);

      res.status(200).json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          address: user.address,
        },
        userProducts
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to load profile' });
    }
  },

  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const { username, email, full_name, address, current_password, new_password } = req.body;

      const user = await userDao.findById(userId);

      // Verifica y cambia contraseña si fue solicitada
      if (new_password) {
        const isValidPassword = await bcrypt.compare(current_password, user.password);
        if (!isValidPassword) {
          return res.status(400).json({ error: 'Current password is incorrect' });
        }

        const hashedPassword = await bcrypt.hash(new_password, 10);
        await userDao.updatePassword(userId, hashedPassword);
      }

      await userDao.update(userId, {
        username,
        email,
        full_name,
        address
      });

      res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }
};
