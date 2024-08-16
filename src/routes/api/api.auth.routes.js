import { Router } from "express";
import { generateToken } from "../../middlewares/auth.middleware.js";
import { handleError } from "../../middlewares/errorHandler.middleware.js";

const router = Router();

// Ruta para iniciar sesión
router.post("/login", generateToken, (req, res, next) => {
    try {
        const token = req.token ?? null;
        return res.status(200).json({ token });
    } catch (error) {
        next(error);
    }
});

// Middleware de manejo de errores
router.use(handleError);

export default router;