import bcrypt from "bcrypt";

// Crea un hash de una contraseña proporcionada
export const createHash = (password) => {
    // Genera un salt (por defecto es 10 rounds)
    const salt = bcrypt.genSaltSync();

    // Crea un hash de la contraseña usando ese salt. La misma, debe
    // ser siempre un string.
    return bcrypt.hashSync(String(password), salt);
};

// Verifica si una contraseña proporcionada es válida para un usuario
export const isValidPassword = (password, hash) => {
    // Compara la contraseña hasheada del usuario con la contraseña
    // proporcionada. La misma, debe ser siempre un string.
    return bcrypt.compareSync(String(password), hash);
};