import { Router } from "express";
import { handleError } from "../middlewares/errorHandler.middleware.js";

const router = Router();

router.get("/", async (req, res, next) => {
    try {
        res.status(200).render("home", { title: "Inicio" });
    } catch (error) {
        next(error);
    }
});

// Middleware de manejo de errores
router.use(handleError);

export default router;