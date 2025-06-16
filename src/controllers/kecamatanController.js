// mybuildv2 From Lalu Aldika
const db = require('../db');
const { validateKecamatanData } = require('../validators/kecamatanValidator');

const createKecamatan = (req, res) => {
    const { nama_kecamatan, id_kab } = req.body;

    const validation = validateKecamatanData(req.body);
    if (!validation.isValid) {
        return res.status(400).json({
            status: 'error',
            message: 'Validasi gagal',
            error: {
                code: 'VALIDATION_ERROR',
                details: validation.errors
            }
        });
    }

    const query = 'INSERT INTO kecamatan (nama_kecamatan, id_kab) VALUES (?, ?)';
    db.query(query, [nama_kecamatan, id_kab], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                status: 'error',
                message: 'Gagal menambahkan kecamatan',
                error: {
                    code: 'DATABASE_ERROR',
                    details: err.message
                }
            });
        }
        res.status(201).json({
            status: 'success',
            message: 'Kecamatan berhasil ditambahkan',
            data: {
                id_kec: result.insertId,
                nama_kecamatan,
                id_kab
            }
        });
    });
};

const getAllKecamatan = (req, res) => {
    const query = 'SELECT * FROM kecamatan WHERE is_deleted = 0';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                status: 'error',
                message: 'Gagal mengambil data kecamatan',
                error: {
                    code: 'DATABASE_ERROR',
                    details: err.message
                }
            });
        }
        res.status(200).json({
            status: 'success',
            data: results
        });
    });
};

const getKecamatanById = (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM kecamatan WHERE id_kec = ? AND is_deleted = 0';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                status: 'error',
                message: 'Gagal mengambil data kecamatan',
                error: {
                    code: 'DATABASE_ERROR',
                    details: err.message
                }
            });
        }
        if (results.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Kecamatan tidak ditemukan',
                error: {
                    code: 'NOT_FOUND',
                    details: `Kecamatan dengan ID ${id} tidak ditemukan`
                }
            });
        }
        res.status(200).json({
            status: 'success',
            data: results[0]
        });
    });
};

const updateKecamatan = (req, res) => {
    const { id } = req.params;
    const { nama_kecamatan, id_kab } = req.body;

    const validation = validateKecamatanData(req.body);
    if (!validation.isValid) {
        return res.status(400).json({
            status: 'error',
            message: 'Validasi gagal',
            error: {
                code: 'VALIDATION_ERROR',
                details: validation.errors
            }
        });
    }

    const query = 'UPDATE kecamatan SET nama_kec = ?, id_kab = ? WHERE id_kec = ? AND is_deleted = 0';
    db.query(query, [nama_kecamatan, id_kab, id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                status: 'error',
                message: 'Gagal memperbarui data kecamatan',
                error: {
                    code: 'DATABASE_ERROR',
                    details: err.message
                }
            });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Kecamatan tidak ditemukan',
                error: {
                    code: 'NOT_FOUND',
                    details: `Kecamatan dengan ID ${id} tidak ditemukan`
                }
            });
        }
        res.status(200).json({
            status: 'success',
            message: 'Kecamatan berhasil diperbarui',
            data: {
                id,
                nama_kecamatan,
                id_kab
            }
        });
    });
};

const deleteKecamatan = (req, res) => {
    const { id } = req.params;
    const query = 'UPDATE kecamatan SET is_deleted = 1 WHERE id_kec = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                status: 'error',
                message: 'Gagal menghapus data kecamatan',
                error: {
                    code: 'DATABASE_ERROR',
                    details: err.message
                }
            });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Kecamatan tidak ditemukan',
                error: {
                    code: 'NOT_FOUND',
                    details: `Kecamatan dengan ID ${id} tidak ditemukan`
                }
            });
        }
        res.status(200).json({
            status: 'success',
            message: 'Kecamatan berhasil dihapus',
            data: { id }
        });
    });
};

const searchKecamatan = (req, res) => {
    const { search } = req.query;

    if (!search) {
        return res.status(400).json({
            status: 'error',
            message: 'Parameter pencarian wajib diisi',
            error: {
                code: 'INVALID_SEARCH',
                details: 'Kata kunci pencarian tidak boleh kosong'
            }
        });
    }

    const query = 'SELECT * FROM kecamatan WHERE nama_kec LIKE ? AND is_deleted = 0';
    db.query(query, [`%${search}%`], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                status: 'error',
                message: 'Gagal mencari data kecamatan',
                error: {
                    code: 'SEARCH_ERROR',
                    details: err.message
                }
            });
        }
        res.status(200).json({
            status: 'success',
            data: results,
            metadata: {
                count: results.length,
                search: search
            }
        });
    });
};

export {
    createKecamatan,
    getAllKecamatan,
    getKecamatanById,
    updateKecamatan,
    deleteKecamatan,
    searchKecamatan
};