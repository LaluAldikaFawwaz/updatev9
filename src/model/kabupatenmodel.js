import connection from '../db/dbconfig.js';

export const insertKabupaten = (id_kab, nama_kab, callback) => {
  const sql = 'INSERT INTO kabupaten (id_kab, nama_kab, is_deleted) VALUES (?, ?, 0)';
  connection.query(sql, [id_kab, nama_kab], callback);
};

export const getAllKabupaten = (callback) => {
  const sql = 'SELECT * FROM kabupaten WHERE is_deleted = 0';
  connection.query(sql, (error, results) => {
    if (error) {
      console.error('Error in getAllKabupaten:', error);
    }
    callback(error, results);
  });
};

export const getKabupatenById = (id, callback) => {
  const sql = 'SELECT * FROM kabupaten WHERE id_kab = ? AND is_deleted = 0';
  connection.query(sql, [id], (error, results) => {
    if (error) {
      console.error('Error in getKabupatenById:', error);
    }
    callback(error, results);
  });
};

export const updateKabupatenById = (id, data, callback) => {
  const sql = 'UPDATE kabupaten SET nama_kab = ? WHERE id_kab = ? AND is_deleted = 0';
  connection.query(sql, [data.nama_kab, id], callback);
};

export const deleteKabupatenById = (id, callback) => {
  const sql = 'UPDATE kabupaten SET is_deleted = 1 WHERE id_kab = ?';
  connection.query(sql, [id], callback);
};

export const searchKabupaten = (searchTerm, callback) => {
  const sql = 'SELECT * FROM kabupaten WHERE nama_kab LIKE ? AND is_deleted = 0';
  connection.query(sql, [`%${searchTerm}%`], callback);
};

export const getKabupatenInnerJoin = (id, callback) => {
    const sql = `
        SELECT k.*, kec.id_kec, kec.nama_kecamatan 
        FROM kabupaten k 
        LEFT JOIN kecamatan kec ON k.id_kab = kec.id_kab 
        WHERE k.id_kab = ? AND k.is_deleted = 0
    `;
    connection.query(sql, [id], callback);
};