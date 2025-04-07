import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserDao } from '../dao/userDao.js';

const userDao = new UserDao();
const JWT_SECRET = process.env.JWT_SECRET || 'secret123'; // Usa variable de entorno si puedes

export const authController = {
  async postLogin(req, res) {
    try {
      const { email, password } = req.body;
      const user = await userDao.findByEmail(email);

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '1d' }
      );

      res.json({ 
        message: 'Login successful', 
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Login failed' });
    }
  },

  async postRegister(req, res) {
    try {
      const { username, email, password, full_name } = req.body;
      const existingUser = await userDao.findByEmail(email);

      if (existingUser) {
        return res.status(409).json({ message: 'Email already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = await userDao.create({
        username,
        email,
        password: hashedPassword,
        full_name
      });

      res.status(201).json({ message: 'User registered', userId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Registration failed' });
    }
  },

  logout(req, res) {
    // Para JWT no se destruye sesión; el frontend borra el token
    res.json({ message: 'Logout successful (frontend should delete token)' });
  }
};
