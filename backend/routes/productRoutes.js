import express from 'express';
import { productController } from '../controllers/productController.js';
import { verifyToken } from '../middleware/veryfyToken.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Configuración de almacenamiento de imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Rutas públicas
router.get('/home', productController.getHome);
router.get('/category/:category', productController.getProductsByCategory);
router.get('/:id', productController.getProduct);

// Rutas protegidas
router.post('/', verifyToken, upload.array('images'), productController.addProduct);
router.put('/:id', verifyToken, upload.array('images'), productController.updateProduct);
router.delete('/:id', verifyToken, productController.deleteProduct);
router.get('/user/products', verifyToken, productController.getProductsByUser);

// Manejo de imágenes
router.delete('/:id/image', verifyToken, productController.deleteImage);

// Variantes
router.get('/:id/variants', productController.getVariants);
router.post('/:id/variants', verifyToken, productController.addVariant);
router.put('/:id/variants/:variantId', verifyToken, productController.updateVariant);
router.delete('/:id/variants/:variantId', verifyToken, productController.deleteVariant);

export default router;
