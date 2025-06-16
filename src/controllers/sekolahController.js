// mybuildv2 From Lalu Aldika
import db from '../db/dbconfig.js';
import { validateSekolahData } from '../validators/sekolahValidator.js';
import { searchSekolah as searchSekolahModel } from '../model/sekolahmodel.js';

const handleSekolahPost = (req, res) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
        try {
            const data = JSON.parse(body);
            const validation = validateSekolahData(data);
            
            if (!validation.isValid) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ errors: validation.errors }));
            }

            const query = 'INSERT INTO sekolah (Nama_Sekolah, NPSN, Status, id_kec) VALUES (?, ?, ?, ?)';
            db.query(query, [data.Nama_Sekolah, data.NPSN, data.Status, data.id_kec], (err, result) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ message: 'Database error' }));
                }
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    message: 'Sekolah berhasil ditambahkan',
                    id: result.insertId 
                }));
            });
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid JSON format' }));
        }
    });
};

const searchSekolah = (req, res) => {
  const { search } = req.query;
  
  if (!search) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      status: 'error',
      message: 'Parameter pencarian wajib diisi',
      error: {
        code: 'INVALID_SEARCH',
        details: 'Kata kunci pencarian tidak boleh kosong'
      }
    }));
  }

  searchSekolahModel(search, (err, results) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({
        status: 'error',
        message: 'Gagal mencari data sekolah',
        error: {
          code: 'SEARCH_ERROR',
          details: err.message || 'Terjadi kesalahan saat mencari data'
        }
      }));
    }
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'success',
      data: results || [],
      metadata: {
        count: results.length,
        search: search
      }
    }));
  });
};

const getAllSekolah = (req, res) => {
  const query = 'SELECT * FROM sekolah WHERE is_deleted = 0';
  db.query(query, (err, results) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: 'Database error' }));
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'success',
      data: results
    }));
  });
};

const getSekolahById = (req, res, id) => {
  const query = 'SELECT * FROM sekolah WHERE No = ? AND is_deleted = 0';
  db.query(query, [id], (err, results) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: 'Database error' }));
    }
    if (results.length === 0) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: 'Sekolah tidak ditemukan' }));
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'success',
      data: results[0]
    }));
  });
};

const updateSekolah = (req, res, id) => {
  let body = '';
  req.on('data', chunk => { body += chunk.toString(); });
  req.on('end', () => {
    try {
      const data = JSON.parse(body);
      const validation = validateSekolahData(data);
      
      if (!validation.isValid) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ errors: validation.errors }));
      }

      const query = 'UPDATE sekolah SET Nama_Sekolah = ?, NPSN = ?, Status = ?, id_kec = ? WHERE No = ? AND is_deleted = 0';
      db.query(query, [data.Nama_Sekolah, data.NPSN, data.Status, data.id_kec, id], (err, result) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ message: 'Database error' }));
        }
        if (result.affectedRows === 0) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ message: 'Sekolah tidak ditemukan' }));
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          message: 'Sekolah berhasil diupdate',
          data: data
        }));
      });
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid JSON format' }));
    }
  });
};

const deleteSekolah = (req, res, id) => {
  const query = 'UPDATE sekolah SET is_deleted = 1 WHERE No = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: 'Database error' }));
    }
    if (result.affectedRows === 0) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: 'Sekolah tidak ditemukan' }));
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Sekolah berhasil dihapus' }));
  });
};

export {
  handleSekolahPost,
  getAllSekolah,
  getSekolahById,
  updateSekolah,
  deleteSekolah,
  searchSekolah
};