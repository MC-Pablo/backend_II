
import mongoose from "mongoose";
import User from "../models/user.model.js";
import { isValidID } from "../config/mongoose.config.js";
import { createHash, isValidPassword } from "../utils/security.js";

import {
    ERROR_INVALID_ID,
    ERROR_NOT_FOUND_ID,
    ERROR_NOT_FOUND_CREDENTIALS,
} from "../constants/messages.constant.js";

export default class UserManager {
    #user;

    constructor() {
        this.#user = User;
    }

    #handleError = (error) => {
        if (error instanceof mongoose.Error.ValidationError) {
            throw new Error(Object.values(error.errors)[0].message);
        }

        throw new Error(error.message);
    };

    #validateId = (id) => {
        if (!isValidID(id)) throw new Error(ERROR_INVALID_ID);
    };

    #findOneById = async (id) => {
        this.#validateId(id);

        const userFound = await this.#user.findOne({ _id: id });
        if (!userFound) throw new Error(ERROR_NOT_FOUND_ID);

        return userFound;
    };

    getAll = async (paramFilters) => {
        try {
            const paginationOptions = {
                limit: paramFilters?.limit ?? 10,
                page: paramFilters?.page ?? 1,
                lean: true,
            };

            const usersFound = await this.#user.paginate({}, paginationOptions);
            return usersFound;
        } catch (error) {
            this.#handleError(error);
        }
    };

    getOneById = async (id) => {
        try {
            const userFound = await this.#findOneById(id);
            return userFound.toObject();
        } catch (error) {
            this.#handleError(error);
        }
    };

    getOneByEmailAndPassword = async (email, password) => {
        try {
            const userFound = await this.#user.findOne({ email });
            if (!userFound) {
                throw new Error(ERROR_NOT_FOUND_CREDENTIALS);
            }

            const hash = userFound.password;
            if (!isValidPassword(password, hash)) {
                throw new Error(ERROR_NOT_FOUND_CREDENTIALS);
            }

            return userFound.toObject();
        } catch (error) {
            this.#handleError(error);
        }
    };

    insertOne = async (data) => {
        try {
            const userCreated = new User({
                ...data,
                password: data.password ? createHash(data.password) : null,
            });

            await userCreated.save();
            return userCreated.toObject();
        } catch (error) {
            this.#handleError(error);
        }
    };

    updateOneById = async (id, data) => {
        try {
            const userFound = await this.#findOneById(id);
            console.log(data.password);

            const newValues = {
                ...data,
                password: data.password ? createHash(data.password) : null,
            };

            userFound.set(newValues);
            await userFound.save();

            return userFound.toObject();
        } catch (error) {
            this.#handleError(error);
        }
    };

    deleteOneById = async (id) => {
        try {
            const userFound = await this.#findOneById(id);
            await this.#user.deleteOne({ _id: userFound._id });

            return userFound.toObject();
        } catch (error) {
            this.#handleError(error);
        }
    };
}