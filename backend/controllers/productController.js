import { ProductDao } from '../dao/productDao.js';

const productDao = new ProductDao();

export const productController = {
  async getHome(req, res) {
    try {
      const products = await productDao.findAll();
      res.status(200).json({ success: true, data: products });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Failed to load products' });
    }
  },

  async getProductsByCategory(req, res) {
    try {
      const { category } = req.params;
      const products = await productDao.findByCategory(category);
      res.status(200).json({ success: true, data: products });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Failed to load products' });
    }
  },

  async getProduct(req, res) {
    try {
      const product = await productDao.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }

      const variants = await productDao.getAvailableVariants(req.params.id);
      res.status(200).json({ success: true, data: { product, variants } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Failed to load product' });
    }
  },

  async addProduct(req, res) {
    try {
      const { name, description, price, category_id } = req.body;
      const sellerId = req.user.id;

      const productId = await productDao.create({
        name,
        description,
        price,
        category_id,
        seller_id: sellerId
      });

      if (req.files && req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
          const imageUrl = `/uploads/${req.files[i].filename}`;
          await productDao.addImage(productId, imageUrl, i === 0);
        }
      }

      res.status(201).json({ success: true, data: { productId } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Failed to add product' });
    }
  },

  async updateProduct(req, res) {
    try {
      const product = await productDao.findById(req.params.id);
      if (!product || product.seller_id !== req.user.id) {
        return res.status(403).json({ success: false, error: 'Unauthorized' });
      }

      const { name, description, price, category_id } = req.body;
      await productDao.update(req.params.id, { name, description, price, category_id });

      if (req.files && req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
          const imageUrl = `/uploads/${req.files[i].filename}`;
          await productDao.addImage(req.params.id, imageUrl, i === 0);
        }
      }

      res.status(200).json({ success: true, message: 'Product updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Failed to update product' });
    }
  },

  async deleteImage(req, res) {
    try {
      const { imageUrl } = req.body;
      const product = await productDao.findById(req.params.id);

      if (!product || product.seller_id !== req.user.id) {
        return res.status(403).json({ success: false, error: 'Unauthorized' });
      }

      await productDao.deleteImage(req.params.id, imageUrl);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Failed to delete image' });
    }
  },

  async getVariants(req, res) {
    try {
      const variants = await productDao.getProductVariants(req.params.id);
      res.status(200).json({ success: true, data: variants });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Failed to get variants' });
    }
  },

  async addVariant(req, res) {
    try {
      const { size, color, stock } = req.body;
      const productId = req.params.id;

      await productDao.addVariant(productId, { size, color, stock: parseInt(stock, 10) });

      res.status(201).json({ success: true, message: 'Variant added successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Failed to add variant' });
    }
  },

  async updateVariant(req, res) {
    try {
      const { size, color, stock } = req.body;
      const product = await productDao.findById(req.params.id);

      if (!product || product.seller_id !== req.user.id) {
        return res.status(403).json({ success: false, error: 'Unauthorized' });
      }

      await productDao.updateVariant(req.params.variantId, {
        size,
        color,
        stock: parseInt(stock, 10)
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Failed to update variant' });
    }
  },

  async deleteVariant(req, res) {
    try {
      const product = await productDao.findById(req.params.id);

      if (!product || product.seller_id !== req.user.id) {
        return res.status(403).json({ success: false, error: 'Unauthorized' });
      }

      await productDao.deleteVariant(req.params.variantId);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Failed to delete variant' });
    }
  },

  async deleteProduct(req, res) {
    try {
      const product = await productDao.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }

      if (product.seller_id !== req.user.id) {
        return res.status(403).json({ success: false, error: 'Unauthorized' });
      }

      await productDao.delete(req.params.id);
      res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message || 'Failed to delete product' });
    }
  },

  async getProductsByUser(req, res) {
    try {
      const products = await productDao.findByUser(req.user.id);
      res.status(200).json({ success: true, data: products });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Failed to load user products' });
    }
  }
};
