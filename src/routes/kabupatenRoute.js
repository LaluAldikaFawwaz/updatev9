import {
    insertKabupaten,
    getAllKabupaten,
    getKabupatenById,
    updateKabupatenById,
    deleteKabupatenById,
    getKabupatenInnerJoin
} from '../model/kabupatenmodel.js';

import responseHandler from '../middlewares/responseHandler.js';
import { validateKabupatenData } from '../validators/kabupatenValidator.js';

// GET all kabupaten
function handleGetAllKabupaten(req, res) {
    getAllKabupaten((err, results) => {
        if (err) {
            return responseHandler.serverError(res, 'Gagal mengambil data kabupaten');
        }
        responseHandler.success(res, 'Data kabupaten berhasil diambil', {
            items: results
        });
    });
}

// GET kabupaten by ID
function handleGetKabupatenById(req, res, id) {
    getKabupatenById(id, (err, results) => {
        if (err) {
            return responseHandler.serverError(res, 'Gagal mengambil data kabupaten');
        }
        if (!results || results.length === 0) {
            return responseHandler.notFound(res, 'Data kabupaten tidak ditemukan');
        }
        responseHandler.success(res, 'Data kabupaten berhasil diambil', results[0]);
    });
}

// POST new kabupaten
function handleKabupatenPost(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            const data = JSON.parse(body);
            const validation = validateKabupatenData(data);

            if (!validation.isValid) {
                return responseHandler.validationError(res, validation.errors);
            }

            insertKabupaten(data.id_kab, data.nama_kab, (err, result) => {
                if (err) {
                    return responseHandler.serverError(res, 'Gagal membuat data kabupaten');
                }
                responseHandler.success(res, 'Data kabupaten berhasil dibuat', {
                    id: result.insertId,
                    ...data
                }, 201);
            });
        } catch (error) {
            responseHandler.validationError(res, {
                format: 'Format JSON tidak valid. Pastikan data yang dikirim sesuai format JSON yang benar.'
            });
        }
    });
}

// PUT update kabupaten
function handleUpdateKabupaten(req, res, id) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            const data = JSON.parse(body);
            const validation = validateKabupatenData(data);

            if (!validation.isValid) {
                return responseHandler.validationError(res, validation.errors);
            }

            updateKabupatenById(id, data, (err, result) => {
                if (err) {
                    return responseHandler.serverError(res, 'Gagal mengupdate data kabupaten');
                }
                if (result.affectedRows === 0) {
                    return responseHandler.notFound(res, 'Data kabupaten tidak ditemukan');
                }
                responseHandler.success(res, 'Data kabupaten berhasil diupdate', {
                    id,
                    ...data
                });
            });
        } catch (error) {
            responseHandler.validationError(res, {
                format: 'Format JSON tidak valid. Pastikan data yang dikirim sesuai format JSON yang benar.'
            });
        }
    });
}

// DELETE kabupaten
function handleDeleteKabupatenById(req, res, id) {
    deleteKabupatenById(id, (err, result) => {
        if (err) {
            return responseHandler.serverError(res, 'Gagal menghapus data kabupaten');
        }
        if (result.affectedRows === 0) {
            return responseHandler.notFound(res, 'Data kabupaten tidak ditemukan');
        }
        responseHandler.success(res, 'Data kabupaten berhasil dihapus');
    });
}

// GET kabupaten with kecamatan
function handleKabupatenInnerJoin(req, res, id) {
    getKabupatenInnerJoin(id, (err, results) => {
        if (err) {
            return responseHandler.serverError(res, 'Gagal mengambil data kabupaten dengan kecamatan');
        }
        if (!results || results.length === 0) {
            return responseHandler.notFound(res, 'Data kabupaten tidak ditemukan');
        }
        responseHandler.success(res, 'Data kabupaten dengan kecamatan berhasil diambil', {
            items: results
        });
    });
}

// Export the handlers
export const kabupatenRoutes = {
    post: handleKabupatenPost,
    put: handleUpdateKabupaten,
    getAll: handleGetAllKabupaten,
    getById: handleGetKabupatenById,
    delete: handleDeleteKabupatenById,
    getInner: handleKabupatenInnerJoin
};