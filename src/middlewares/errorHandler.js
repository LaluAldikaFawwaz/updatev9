// Custom error class untuk API errors
export class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.status = 'error';
    }
}

// Middleware error handler global
export const errorHandler = (err, req, res) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Terjadi kesalahan pada server';

    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        success: false,
        code: statusCode,
        message: message,
        data: null,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }));
};

// Middleware untuk menangani route yang tidak ditemukan
export const notFoundHandler = (req, res) => {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        success: false,
        code: 404,
        message: 'Route tidak ditemukan',
        data: null
    }));
};

// Middleware untuk menangani error async
export const asyncHandler = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            errorHandler(error, req, res);
        }
    };
};