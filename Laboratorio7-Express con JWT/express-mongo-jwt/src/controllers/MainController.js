class MainController {
    async getSignIn(req, res) {
        res.render('signIn');
    }

    async getSignUp(req, res) {
        res.render('signUp');
    }

    async getDashboard(req, res) {
        res.render('dashboard');
    }

}

export default new MainController();
