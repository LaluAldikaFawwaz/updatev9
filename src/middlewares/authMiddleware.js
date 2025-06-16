import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'error',
        message: 'Authorization header tidak ditemukan'
      }));
      return;
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'error',
        message: 'Token tidak ditemukan'
      }));
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.writeHead(403, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'error',
      message: error.name === 'TokenExpiredError' ? 'Token telah kadaluarsa' : 'Token tidak valid'
    }));
  }
};

export function authMiddleware(req, res, next) {
    // Get the authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.writeHead(401, { 'Content-Type': 'application/json' })
            .end(JSON.stringify({
                status: "error",
                message: "Akses ditolak",
                errors: {
                    auth: "Token autentikasi tidak ditemukan"
                }
            }));
    }

    // Check if it's Basic Auth
    if (!authHeader.startsWith('Basic ')) {
        return res.writeHead(401, { 'Content-Type': 'application/json' })
            .end(JSON.stringify({
                status: "error",
                message: "Akses ditolak",
                errors: {
                    auth: "Format autentikasi tidak valid"
                }
            }));
    }

    // Get the base64 encoded credentials
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    // Check credentials (in a real app, this would check against a database)
    if (username === 'admin' && password === 'admin') {
        // Add user info to request object
        req.user = { username: 'admin' };
        next();
    } else {
        return res.writeHead(401, { 'Content-Type': 'application/json' })
            .end(JSON.stringify({
                status: "error",
                message: "Akses ditolak",
                errors: {
                    auth: "Username atau password salah"
                }
            }));
    }
}

export { verifyToken };