import express from 'express';
import MainController  from '../controllers/MainController.js';
import authenticate from '../middlewares/authenticate.js';

const router = express.Router();

router.get('/', MainController.getSignUp);
router.get('/signin', MainController.getSignIn);

router.get('/dashboard', authenticate, (req, res) => {
    res.render('dashboard');
});

export default router;