import authService from "../services/AuthService.js";

class AuthController {
  async signUp(req, res, next) {
    try {
      const payload = req.body;
      if (!payload.email || !payload.password)
        return res
          .status(400)
          .json({ message: "El email y password son requeridos" });

      await authService.signUp(payload);
      return res.redirect("/signIn");
    } catch (err) {
      next(err);
    }
  }

  async signIn(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res
          .status(400)
          .json({ message: "El email y password son requeridos" });

      const { token } = await authService.signIn({ email, password });

      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });
      
      return res.redirect("/dashboard");
    } catch (err) {
      next(err);
    }
  }
}

export default new AuthController();
