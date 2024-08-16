import { STATUS_CODES } from "../constants/messages.constant.js";

// Middleware para manejar errores de forma centralizada
// Importante: Es determinante mantener declarado el 4to parámetro "next".
// eslint-disable-next-line no-unused-vars
export const handleError = (error, req, res, next) => {
    // Verifica si el error tiene un código de estado asociado en STATUS_CODES
    const code = STATUS_CODES[error.message] ?? 500;

    // Envía una respuesta JSON con el código de estado y el mensaje de error
    res.status(code).json({ status: false, message: error.message });
};