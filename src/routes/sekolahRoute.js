import {
    createSekolah, 
    getAllSekolah, 
    getSekolahById, 
    updateSekolahById, 
    deleteSekolahById,
    searchSekolah,
    getfilterinner
} from '../model/sekolahmodel.js';

import responseHandler from '../middlewares/responseHandler.js';
import { validateSekolahData } from '../validators/sekolahValidator.js';

// GET all sekolah
function handleGetAllSekolah(req, res) {
    getAllSekolah((err, results) => {
        if (err) {
            return responseHandler.serverError(res, 'Gagal mengambil data sekolah');
        }
        responseHandler.success(res, 'Data sekolah berhasil diambil', {
            items: results
        });
    });
}

// Search sekolah with advanced filtering
function handleSearchSekolah(req, res) {
    const params = {
        search: req.query.search,
        Status: req.query.status,
        id_kec: req.query.kecamatan,
        sortBy: req.query.sortBy,
        sortOrder: req.query.sortOrder
    };

    if (!params.search && !params.Status && !params.id_kec) {
        return responseHandler.validationError(res, {
            search: 'Minimal satu parameter pencarian harus diisi'
        });
    }

    searchSekolah(params, (err, results) => {
        if (err) {
            return responseHandler.serverError(res, 'Gagal mencari data sekolah');
        }
        responseHandler.success(res, 'Pencarian sekolah berhasil', {
            items: results,
            metadata: {
                params: params,
                total: results.length
            }
        });
    });
}

// GET sekolah by ID
function handleGetSekolahById(req, res, id) {
    getSekolahById(id, (err, results) => {
        if (err) {
            return responseHandler.serverError(res, 'Gagal mengambil data sekolah');
        }
        if (!results || results.length === 0) {
            return responseHandler.notFound(res, 'Data sekolah tidak ditemukan');
        }
        responseHandler.success(res, 'Data sekolah berhasil diambil', results[0]);
    });
}

// POST new sekolah
function handleSekolahPost(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            const data = JSON.parse(body);
            const validation = validateSekolahData(data);

            if (!validation.isValid) {
                return responseHandler.validationError(res, validation.errors);
            }

            createSekolah(data, (err, result) => {
                if (err) {
                    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                        return responseHandler.validationError(res, {
                            id_kec: 'ID Kecamatan yang dimasukkan tidak ditemukan'
                        });
                    }
                    return responseHandler.serverError(res, 'Gagal membuat data sekolah');
                }
                responseHandler.success(res, 'Data sekolah berhasil dibuat', {
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

// PUT update sekolah
function handleUpdateSekolah(req, res, id) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            const data = JSON.parse(body);
            const validation = validateSekolahData(data);

            if (!validation.isValid) {
                return responseHandler.validationError(res, validation.errors);
            }

            updateSekolahById(id, data, (err, result) => {
                if (err) {
                    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                        return responseHandler.validationError(res, {
                            id_kec: 'ID Kecamatan yang dimasukkan tidak ditemukan'
                        });
                    }
                    return responseHandler.serverError(res, 'Gagal mengupdate data sekolah');
                }
                if (result.affectedRows === 0) {
                    return responseHandler.notFound(res, 'Data sekolah tidak ditemukan');
                }
                responseHandler.success(res, 'Data sekolah berhasil diupdate', {
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

// DELETE sekolah
function handleDeleteSekolahById(req, res, id) {
    deleteSekolahById(id, (err, result) => {
        if (err) {
            return responseHandler.serverError(res, 'Gagal menghapus data sekolah');
        }
        if (result.affectedRows === 0) {
            return responseHandler.notFound(res, 'Data sekolah tidak ditemukan');
        }
        responseHandler.success(res, 'Data sekolah berhasil dihapus');
    });
}

// GET sekolah with kecamatan and kabupaten
function handleGetSekolahInner(req, res) {
    getfilterinner((err, results) => {
        if (err) {
            return responseHandler.serverError(res, 'Gagal mengambil data sekolah dengan kecamatan dan kabupaten');
        }
        if (!results || results.length === 0) {
            return responseHandler.notFound(res, 'Data sekolah tidak ditemukan');
        }
        responseHandler.success(res, 'Data sekolah dengan kecamatan dan kabupaten berhasil diambil', {
            items: results
        });
    });
}

// Export the handlers
export const sekolahRoutes = {
    post: handleSekolahPost,
    put: handleUpdateSekolah,
    getAll: handleGetAllSekolah,
    getById: handleGetSekolahById,
    delete: handleDeleteSekolahById,
    search: handleSearchSekolah,
    getInner: handleGetSekolahInner
};
