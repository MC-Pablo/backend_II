import jwt from "jsonwebtoken";
import passport from "passport";
import UserManager from "../managers/user.manager.js";
import { ERROR_NOT_HAVE_PRIVILEGES, JWT_TRANSLATIONS } from "../constants/messages.constant.js";

const userManager = new UserManager();

// Middleware para generar un token de acceso para un usuario autenticado
export const generateToken = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Busca al usuario por email y contraseña
        const userFound = await userManager.getOneByEmailAndPassword(email, password);

        // Genera un token JWT que expira en 2 horas
        const token = jwt.sign({ id: userFound._id }, process.env.SECRET_KEY, { expiresIn: "2h" });

        // Coloca el token en el request
        req.token = token;

        // Llama al siguiente middleware
        next();
    } catch (error) {
        next(error);
    }
};

// Middleware para verificar la autenticación del usuario
export const checkAuth = (req, res, next) => {
    // Autentica al usuario utilizando la estrategia proporcionada por Passport
    passport.authenticate("jwt-api", { session: false }, (error, user, info) => {
        if (error) return next(error);

        // Si el usuario no se ha autenticado, retorna un mensaje de error 401
        if (!user) {
            return next(new Error(JWT_TRANSLATIONS[info.message] ?? info.message));
        }

        // Guarda el rol del usuario en el request
        req.role = user.role;

        // Llama al siguiente middleware
        next();
    })(req, res, next);
};

// Middleware para verificar si el usuario es un administrador
export const checkAdminRole = (req, res, next) => {
    // Si el usuario no tiene rol de administrador, retorna un mensaje de error 403
    if (req.role != "admin") {
        return next(new Error(ERROR_NOT_HAVE_PRIVILEGES));
    }

    // Si el usuario tiene rol de administrador, llama al siguiente middleware
    return next();
};