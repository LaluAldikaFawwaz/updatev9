import {
    createKecamatan,
    getAllKecamatan,
    getKecamatanById,
    updateKecamatanById,
    deleteKecamatanById,
    sortingkecamatan
} from '../model/kecamatanmodel.js';

import responseHandler from '../middlewares/responseHandler.js';
import jsonValidationMiddleware from '../middlewares/jsonValidationMiddleware.js';
import { validateKecamatanData } from '../validators/kecamatanValidator.js';

// Validasi input untuk pembuatan kecamatan (POST)
function validateKecamatanInput(data) {
    const errors = {};
    if (!data.nama_kec) errors.nama_kec = 'Nama Kecamatan wajib diisi.';
    if (!data.id_kab) errors.id_kab = 'ID Kabupaten wajib diisi.';
    return errors;
}

// Validasi input untuk update kecamatan (PUT)
function validateUpdateKecamatanInput(data) {
    const errors = {};
    if (data.id_kec !== undefined) errors.id_kec = 'Field id_kec tidak diperbolehkan untuk diubah.';
    if (data.nama_kec === undefined) errors.nama_kec = 'Field nama_kec wajib diisi.';
    if (data.id_kab === undefined) errors.id_kab = 'Field id_kab wajib diisi.';
    return errors;
}

// GET all kecamatan
function handleGetAllKecamatan(req, res) {
    getAllKecamatan((err, results) => {
        if (err) {
            return responseHandler.serverError(res, 'Gagal mengambil data kecamatan');
        }
        responseHandler.success(res, 'Data kecamatan berhasil diambil', {
            items: results
        });
    });
}

// GET kecamatan by ID
function handleGetKecamatanById(req, res, id) {
    getKecamatanById(id, (err, results) => {
        if (err) {
            return responseHandler.serverError(res, 'Gagal mengambil data kecamatan');
        }
        if (!results || results.length === 0) {
            return responseHandler.notFound(res, 'Data kecamatan tidak ditemukan');
        }
        responseHandler.success(res, 'Data kecamatan berhasil diambil', results[0]);
    });
}

// POST new kecamatan
function handleKecamatanPost(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            const data = JSON.parse(body);
            const validation = validateKecamatanData(data);

            if (!validation.isValid) {
                return responseHandler.validationError(res, validation.errors);
            }

            createKecamatan(data, (err, result) => {
                if (err) {
                    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                        return responseHandler.validationError(res, {
                            id_kab: 'ID Kabupaten yang dimasukkan tidak ditemukan'
                        });
                    }
                    return responseHandler.serverError(res, 'Gagal membuat data kecamatan');
                }
                responseHandler.success(res, 'Data kecamatan berhasil dibuat', {
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

// PUT update kecamatan
function handleUpdateKecamatan(req, res, id) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            const data = JSON.parse(body);
            const validation = validateKecamatanData(data);

            if (!validation.isValid) {
                return responseHandler.validationError(res, validation.errors);
            }

            updateKecamatanById(id, data, (err, result) => {
                if (err) {
                    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                        return responseHandler.validationError(res, {
                            id_kab: 'ID Kabupaten yang dimasukkan tidak ditemukan'
                        });
                    }
                    return responseHandler.serverError(res, 'Gagal mengupdate data kecamatan');
                }
                if (result.affectedRows === 0) {
                    return responseHandler.notFound(res, 'Data kecamatan tidak ditemukan');
                }
                responseHandler.success(res, 'Data kecamatan berhasil diupdate', {
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

// DELETE kecamatan
function handleDeleteKecamatan(req, res, id) {
    deleteKecamatanById(id, (err, result) => {
        if (err) {
            return responseHandler.serverError(res, 'Gagal menghapus data kecamatan');
        }
        if (result.affectedRows === 0) {
            return responseHandler.notFound(res, 'Data kecamatan tidak ditemukan');
        }
        responseHandler.success(res, 'Data kecamatan berhasil dihapus');
    });
}

// GET - Sorting data kecamatan
function handleSortingKecamatan(req, res) {
    sortingkecamatan((err, results) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: false, message: 'Gagal mengambil data kecamatan.', error: err.message }));
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Data kecamatan berhasil diambil.', data: results }));
    });
}

// Export the middleware-wrapped handlers
export const kecamatanRoutes = {
    post: handleKecamatanPost,
    put: handleUpdateKecamatan,
    getAll: handleGetAllKecamatan,
    getById: handleGetKecamatanById,
    delete: handleDeleteKecamatan
};
