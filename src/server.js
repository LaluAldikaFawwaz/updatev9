import http from 'http';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { verifyToken } from './middlewares/authMiddleware.js';

// Import route handlers
import { kabupatenRoutes } from './routes/kabupatenRoute.js';
import { kecamatanRoutes } from './routes/kecamatanRoute.js';
import { sekolahRoutes } from './routes/sekolahRoute.js';
import { authRoutes } from './routes/authRoute.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const server = http.createServer(async (req, res) => {
    try {
        const { pathname } = new URL(req.url, `http://${req.headers.host}`);

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (req.method === 'OPTIONS') {
            res.writeHead(204);
            return res.end();
        }

        if (req.method === 'POST' && pathname === '/login') {
            return authRoutes.login(req, res);
        }

        verifyToken(req, res, () => {
            try {
                // Route handling for kabupaten
                if (pathname.startsWith('/kabupaten')) {
                    const idMatch = pathname.match(/^\/kabupaten\/([^\/]+)$/);
                    const joinMatch = pathname.match(/^\/kabupaten\/join\/([^\/]+)$/);

                    if (req.method === 'GET') {
                        if (joinMatch) return kabupatenRoutes.getInner(req, res, joinMatch[1]);
                        if (idMatch) return kabupatenRoutes.getById(req, res, idMatch[1]);
                        return kabupatenRoutes.getAll(req, res);
                    }
                    if (req.method === 'POST') return kabupatenRoutes.post(req, res);
                    if (req.method === 'PUT' && idMatch) return kabupatenRoutes.put(req, res, idMatch[1]);
                    if (req.method === 'DELETE' && idMatch) return kabupatenRoutes.delete(req, res, idMatch[1]);
                }

                // Route handling for kecamatan
                if (pathname.startsWith('/kecamatan')) {
                    const idMatch = pathname.match(/^\/kecamatan\/([^\/]+)$/);
                    if (req.method === 'GET') {
                        if (idMatch) return kecamatanRoutes.getById(req, res, idMatch[1]);
                        return kecamatanRoutes.getAll(req, res);
                    }
                    if (req.method === 'POST') return kecamatanRoutes.post(req, res);
                    if (req.method === 'PUT' && idMatch) return kecamatanRoutes.put(req, res, idMatch[1]);
                    if (req.method === 'DELETE' && idMatch) return kecamatanRoutes.delete(req, res, idMatch[1]);
                }

                // Route handling for sekolah
                if (pathname.startsWith('/sekolah')) {
                    const idMatch = pathname.match(/^\/sekolah\/([^\/]+)$/);
                    if (req.method === 'GET') {
                        if (pathname === '/sekolah/inner') return sekolahRoutes.getInner(req, res);
                        if (pathname === '/sekolah/search') return sekolahRoutes.search(req, res);
                        if (idMatch) return sekolahRoutes.getById(req, res, idMatch[1]);
                        return sekolahRoutes.getAll(req, res);
                    }
                    if (req.method === 'POST') return sekolahRoutes.post(req, res);
                    if (req.method === 'PUT' && idMatch) return sekolahRoutes.put(req, res, idMatch[1]);
                    if (req.method === 'DELETE' && idMatch) return sekolahRoutes.delete(req, res, idMatch[1]);
                }

                // Handle 404
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'error', message: 'Route tidak ditemukan' }));
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'error', message: 'Terjadi kesalahan pada server' }));
            }
        });
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'error', message: 'Terjadi kesalahan pada server' }));
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});




