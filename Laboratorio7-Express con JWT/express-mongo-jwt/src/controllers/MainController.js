
import userService from '../services/UserService.js';

class MainController {
    async getProfile(req, res, next) {
        try {
            const userId = req.userId;
            const user = await userService.getById(userId);
            const role = user.roles && user.roles.length > 0 ? user.roles[0] : null;
            res.render('profile', { user, role });
        } catch (err) {
            next(err);
        }
    }

    async getSignIn(req, res) {
        res.render('signIn');
    }

    async getSignUp(req, res) {
        res.render('signUp');
    }

    async getDashboard(req, res) {
        const role = req.userRoles && req.userRoles.length > 0 ? req.userRoles[0] : null;
        res.render('dashboard', { role });
    }

    async getDashboardAdmin(req, res) {
        const role = req.userRoles && req.userRoles.length > 0 ? req.userRoles[0] : null;
        res.render('dashboardAdmin', { role, users: req.users || [] });
    }
}

export default new MainController();
