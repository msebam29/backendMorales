import { CustomError } from "../errors/customError";

export function errorHandler(err, req, res, next) {
    if (err instanceof CustomError) {
        const errorResponse = {
            code: err.code,
            message: err.message
        };
        return res.status(err.status).json(errorResponse);
    }

    const errorResponse = {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred.'
    };
    return res.status(500).json(errorResponse);
}
