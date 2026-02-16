import { Router } from 'express';
import { EmailConfigController } from '../controllers/emailConfig.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// CRUD operations
router.post('/', EmailConfigController.createEmailConfigController);
router.get('/', EmailConfigController.getAllEmailConfigsController);
router.get('/active', EmailConfigController.getActiveConfigsController);
router.get('/:id', EmailConfigController.getEmailConfigByIdController);
router.put('/:id', EmailConfigController.updateEmailConfigController);
router.delete('/:id', EmailConfigController.deleteEmailConfigController);

// Special operations
router.post('/:id/test', EmailConfigController.testEmailConfigController);
router.put('/:id/set-active', EmailConfigController.setActiveConfigController);
router.get('/:id/stats', EmailConfigController.getEmailConfigStatsController);

export default router;
