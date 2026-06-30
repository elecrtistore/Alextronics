import { Router } from 'express';
import * as inquiryController from '../controllers/inquiryController';

const router = Router();

router.post('/', inquiryController.createInquiry);
router.get('/', inquiryController.getInquiries);
router.get('/:id', inquiryController.getInquiryById);
router.put('/:id/status', inquiryController.updateInquiryStatus);

export default router;
