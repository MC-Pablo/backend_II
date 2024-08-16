import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import UserManager from "../managers/user.manager.js";

const userManager = new UserManager();

export const config = (server) => {
    // Opciones para la estrategia JWT basada en el encabezado Authorization
    const jwtApiOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.SECRET_KEY,
    };

    // Función que maneja el inicio de sesión
    const handleLogin = async (payload, done) => {
        try {
            const userFound = await userManager.getOneById(payload.id);
            return done(null, userFound);
        } catch (error) {
            return done(null, false, { message: error.message });
        }
    };

    // Configura las estrategias JWT para Passport
    passport.use("jwt-api", new JwtStrategy(jwtApiOptions, handleLogin));

    // Inicializa Passport en el servidor
    server.use(passport.initialize());
};