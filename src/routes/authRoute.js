import { validateAuthData } from '../validators/authValidator.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

function handleAuth(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            const data = JSON.parse(body);
            const validation = validateAuthData(data);

            if (!validation.isValid) {
                return res.writeHead(400, { 'Content-Type': 'application/json' })
                    .end(JSON.stringify({
                        status: "error",
                        message: "Validasi gagal",
                        errors: validation.errors
                    }));
            }

            // Generate JWT token
            const token = jwt.sign(
                { username: data.username },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '24h' }
            );

            // If validation passes, return success with token
            res.writeHead(200, { 'Content-Type': 'application/json' })
                .end(JSON.stringify({
                    status: "success",
                    message: "Login berhasil",
                    data: {
                        username: data.username,
                        token: token
                    }
                }));

        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' })
                .end(JSON.stringify({
                    status: "error",
                    message: "Format JSON tidak valid",
                    errors: {
                        format: "Format JSON tidak valid. Pastikan data yang dikirim sesuai format JSON yang benar."
                    }
                }));
        }
    });
}

// Protected route example
function handleProtectedRoute(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' })
        .end(JSON.stringify({
            status: "success",
            message: "Akses ke route terproteksi berhasil",
            data: {
                user: req.user
            }
        }));
}

export const authRoutes = {
    login: handleAuth,
    protected: [authMiddleware, handleProtectedRoute]
}; 