import kabupatenModel from '../model/kabupatenmodel.js';
import { validateKabupatenData } from '../validators/kabupatenValidator.js';

// Remove 'export' from individual function declarations
function createKabupaten(req, res) {
  const { id_kab, nama_kab } = req.body;

  // Tambahkan validasi
  const validation = validateKabupatenData({ nama_kab });
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

  kabupatenModel.insertKabupaten(id_kab, nama_kab, (err, result) => {
    if (err) {
      console.error('Database error:', {
        message: err.message,
        stack: err.stack,
        data: { id_kab, nama_kab }
      });

      if (err.message === 'ID Kabupaten sudah terdaftar') {
        return res.status(409).json({
          status: 'error',
          message: err.message,
          error: {
            code: 'DUPLICATE_ENTRY',
            details: 'ID Kabupaten telah digunakan'
          }
        });
      }

      return res.status(500).json({
        status: 'error',
        message: 'Gagal menambahkan kabupaten',
        error: {
          code: 'DATABASE_ERROR',
          details: 'Terjadi kesalahan saat menyimpan data'
        }
      });
    }

    res.status(201).json({
      status: 'success',
      message: 'Kabupaten berhasil ditambahkan',
      data: {
        id_kab,
        nama_kab
      }
    });
  });
}

function getAllKabupaten(req, res) {
  const sort = req.query?.sort || 'asc';

  kabupatenModel.getAllKabupaten(sort, (err, results) => {
    if (err) {
      console.error('Database error:', {
        message: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString()
      });
      
      res.statusCode = 500;
      return res.end(JSON.stringify({
        status: 'error',
        message: 'Gagal mengambil data kabupaten',
        error: {
          code: 'DATABASE_ERROR',
          details: err.message || 'Terjadi kesalahan saat mengambil data dari database'
        }
      }));
    }
    
    console.log('Query results:', {
      count: results.length,
      timestamp: new Date().toISOString()
    });
    
    res.statusCode = 200;
    res.end(JSON.stringify({
      status: 'success',
      data: results || [],
      metadata: {
        count: results.length,
        sort: sort
      }
    }));
  });
}

function searchKabupaten(req, res) {
  const { search, sort = 'asc' } = req.query;
  
  if (!search) {
    res.statusCode = 400;
    return res.end(JSON.stringify({
      status: 'error',
      message: 'Parameter pencarian wajib diisi',
      error: {
        code: 'INVALID_SEARCH',
        details: 'Kata kunci pencarian tidak boleh kosong'
      }
    }));
  }

  kabupatenModel.searchKabupaten(search, sort, (err, results) => {
    if (err) {
      console.error('Search error:', {
        message: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString()
      });
      
      res.statusCode = 500;
      return res.end(JSON.stringify({
        status: 'error',
        message: 'Gagal mencari data kabupaten',
        error: {
          code: 'SEARCH_ERROR',
          details: err.message || 'Terjadi kesalahan saat mencari data'
        }
      }));
    }
    
    res.statusCode = 200;
    res.end(JSON.stringify({
      status: 'success',
      data: results || [],
      metadata: {
        count: results.length,
        search: search,
        sort: sort
      }
    }));
  });
}

function updateKabupaten(req, res) {
  const id_kab = req.params.id;
  const data = req.body;

  if (!id_kab) {
    return res.status(400).json({
      status: 'error',
      message: 'ID Kabupaten wajib diisi',
      error: {
        code: 'INVALID_INPUT',
        details: 'ID Kabupaten tidak boleh kosong'
      }
    });
  }

  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Data update tidak valid',
      error: {
        code: 'INVALID_DATA',
        details: 'Data yang dikirim tidak boleh kosong'
      }
    });
  }

  kabupatenModel.updateKabupatenById(id_kab, data, (err, result) => {
    if (err) {
      console.error('Database error:', {
        message: err.message,
        stack: err.stack,
        id: id_kab,
        data: data
      });
      
      switch(err.message) {
        case 'Kabupaten tidak ditemukan':
        case 'Data kabupaten tidak ditemukan':
          return res.status(404).json({
            status: 'error',
            message: `Data kabupaten dengan ID ${id_kab} tidak ditemukan`,
            error: {
              code: 'NOT_FOUND',
              details: `ID kabupaten ${id_kab} tidak terdaftar dalam database`
            }
          });
        case 'Field id_kab tidak diperbolehkan untuk diubah':
        case 'Data update tidak boleh kosong':
        case 'Tidak ada field valid yang dapat diupdate':
          return res.status(400).json({
            status: 'error',
            message: err.message,
            error: {
              code: 'INVALID_UPDATE',
              details: err.message
            }
          });
        default:
          return res.status(500).json({
            status: 'error',
            message: 'Terjadi kesalahan pada server',
            error: {
              code: 'DATABASE_ERROR',
              details: `Gagal memperbarui data: ${err.message}`
            }
          });
      }
    }

    res.json({
      status: 'success',
      message: 'Data kabupaten berhasil diperbarui',
      data: {
        id_kab,
        ...result.updatedData
      }
    });
  });
}

function deleteKabupaten(req, res) {
  const id = req.params.id;
  
  if (!id) {
    return res.status(400).json({
      status: 'error',
      message: 'ID Kabupaten wajib diisi',
      error: {
        code: 'INVALID_INPUT',
        details: 'ID Kabupaten tidak boleh kosong'
      }
    });
  }

  kabupatenModel.deleteKabupatenById(id, (err, result) => {
    if (err) {
      console.error('Delete Error:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Gagal menghapus data',
        error: {
          code: 'DATABASE_ERROR',
          details: err.message
        }
      });
    }

    res.json({
      status: 'success',
      message: 'Data kabupaten berhasil dihapus',
      id: id
    });
  });
}

// Export all functions at once
export {
  createKabupaten,
  getAllKabupaten,
  updateKabupaten,
  deleteKabupaten,
  searchKabupaten
};