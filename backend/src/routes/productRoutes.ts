import { Router } from 'express';
import * as productController from '../controllers/productController';
import { validateFirebaseToken } from '../middleware/validateFirebaseToken';
import { adminGuard } from '../middleware/adminGuard';

const router = Router();

router.get('/', productController.getProducts);
router.get('/share/:shareId', productController.getProductByShareId);
router.get('/:id', productController.getProductById);
router.post('/normalize-stock', validateFirebaseToken, adminGuard, productController.normalizeExistingProductStock);
router.post('/import', validateFirebaseToken, adminGuard, productController.importProducts);
router.post('/', validateFirebaseToken, adminGuard, productController.validateProduct, productController.createProduct);
router.put('/:id', validateFirebaseToken, adminGuard, productController.updateProduct);
router.delete('/:id', validateFirebaseToken, adminGuard, productController.deleteProduct);

export default router;
