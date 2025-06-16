import responseHandler from './responseHandler.js';

const jsonValidationMiddleware = (validator) => {
    return (req, res, next) => {
        // Only process POST and PUT requests
        if (req.method !== 'POST' && req.method !== 'PUT') {
            return next();
        }

        let body = '';
        const timeout = setTimeout(() => {
            res.writeHead(408, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                status: 'error', 
                message: 'Request timeout' 
            }));
        }, 30000);

        req.on('error', (err) => {
            clearTimeout(timeout);
            responseHandler.serverError(res, 'Error reading request data');
        });

        req.on('data', chunk => {
            body += chunk.toString();
            if (body.length > 1e6) { // 1MB limit
                clearTimeout(timeout);
                req.destroy();
                responseHandler.validationError(res, {
                    body: 'Payload terlalu besar'
                });
            }
        });

        req.on('end', () => {
            clearTimeout(timeout);
            try {
                if (!body) {
                    return responseHandler.validationError(res, {
                        body: 'Request body tidak boleh kosong'
                    });
                }

                const data = JSON.parse(body);
                const validation = validator(data);
                
                if (!validation.isValid) {
                    return responseHandler.validationError(res, validation.errors);
                }
                
                req.body = data;
                next();
            } catch (error) {
                responseHandler.validationError(res, {
                    format: 'Format JSON tidak valid. Pastikan data yang dikirim sesuai format JSON yang benar.'
                });
            }
        });
    };
};

export default jsonValidationMiddleware; 