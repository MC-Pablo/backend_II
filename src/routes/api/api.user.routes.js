import { Router } from "express";
import UserManager from "../../managers/user.manager.js";
import { handleError } from "../../middlewares/errorHandler.middleware.js";

const router = Router();
const userManager = new UserManager();

// Ruta para obtener todos los usuarios
router.get("/", async (req, res, next) => {
    try {
        const users = await userManager.getAll(req.query);
        res.status(200).json({ status: true, payload: users });
    } catch (error) {
        next(error);
    }
});

// Ruta para obtener un usuario por ID
router.get("/:id", async (req, res, next) => {
    try {
        const user = await userManager.getOneById(req.params.id);
        res.status(200).json({ status: true, payload: user });
    } catch (error) {
        next(error);
    }
});

// Ruta para crear un nuevo usuario
router.post("/", async (req, res, next) => {
    try {
        const user = await userManager.insertOne(req.body);
        res.status(201).json({ status: true, payload: user });
    } catch (error) {
        next(error);
    }
});

// Ruta para actualizar un usuario existente por ID
router.put("/:id", async (req, res, next) => {
    try {
        const user = await userManager.updateOneById(req.params.id, req.body);
        res.status(200).json({ status: true, payload: user });
    } catch (error) {
        next(error);
    }
});

// Ruta para eliminar un usuario por ID
router.delete("/:id", async (req, res, next) => {
    try {
        const user = await userManager.deleteOneById(req.params.id);
        res.status(200).json({ status: true, payload: user });
    } catch (error) {
        next(error);
    }
});

// Middleware de manejo de errores
router.use(handleError);

export default router;