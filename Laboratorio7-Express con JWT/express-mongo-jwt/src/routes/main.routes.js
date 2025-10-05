import express from 'express';
import MainController  from '../controllers/MainController.js';
import authenticate from '../middlewares/authenticate.js';
import authorize from '../middlewares/authorize.js';
import UserService from '../services/UserService.js';

const router = express.Router();

router.get('/', MainController.getSignUp);
router.get('/signin', MainController.getSignIn);


router.get('/dashboard', authenticate, MainController.getDashboard);

router.get('/profile', authenticate, MainController.getProfile);

router.get('/dashboardAdmin', authenticate, authorize(['admin']), async (req, res, next) => {
    try {
        const users = await UserService.getAll();
        req.users = users;
        MainController.getDashboardAdmin(req, res, next);
    } catch (err) {
        next(err);
    }
});

export default router;