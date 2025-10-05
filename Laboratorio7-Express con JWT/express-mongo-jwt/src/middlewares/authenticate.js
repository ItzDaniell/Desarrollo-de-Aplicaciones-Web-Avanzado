import jwt from 'jsonwebtoken';

export default function authenticate(req, res, next) {
    try {
        const token = req.cookies.token;
        if (!token)
            return res.status(401).render('403', { message: 'No autorizado' });

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = payload.sub;
        req.userRoles = payload.roles || [];
        next();

    } catch (err) {
        return res.status(401).render('403', { message: 'Token no válido o caducado' });
    }
}
