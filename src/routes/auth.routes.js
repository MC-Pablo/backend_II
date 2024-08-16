import { Router } from "express";
import { generateToken } from "../middlewares/auth.middleware.js";
import { handleError } from "../middlewares/errorHandler.middleware.js";

const router = Router();

// Ruta de la página de inicio de sesión
router.get("/login", async (req, res) => {
    res.status(200).render("login");
});

// Ruta para iniciar sesión
router.post("/login", generateToken, (req, res) => {
    res.status(200).redirect("/ingredients");
});

// Ruta para cerrar sesión
router.get("/logout", (req, res) => {
    // Borra la cookie que contiene el token
    res.clearCookie("token");
    res.status(200).redirect("/");
});

// Middleware de manejo de errores
router.use(handleError);

export default router;