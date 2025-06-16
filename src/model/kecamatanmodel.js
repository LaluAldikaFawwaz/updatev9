import connection from '../db/dbconfig.js';

export const createKecamatan = (data, callback) => {
  const sql = 'INSERT INTO kecamatan (id_kec, nama_kecamatan, id_kab, is_deleted) VALUES (?, ?, ?, 0)';
  connection.query(sql, [data.id_kec, data.nama_kecamatan, data.id_kab], callback);
};

export const getAllKecamatan = (callback) => {
  const sql = 'SELECT * FROM kecamatan WHERE is_deleted = 0';
  connection.query(sql, callback);
};

export const getKecamatanById = (id, callback) => {
  const sql = 'SELECT * FROM kecamatan WHERE id_kec = ? AND is_deleted = 0';
  connection.query(sql, [id], callback);
};

export const updateKecamatanById = (id, data, callback) => {
  const sql = 'UPDATE kecamatan SET nama_kecamatan = ?, id_kab = ? WHERE id_kec = ? AND is_deleted = 0';
  connection.query(sql, [data.nama_kec, data.id_kab, id], callback);
};

export const deleteKecamatanById = (id, callback) => {
  const sql = 'UPDATE kecamatan SET is_deleted = 1 WHERE id_kec = ?';
  connection.query(sql, [id], callback);
};

export const sortingkecamatan = (callback) => {
  const sql = 'SELECT * FROM kecamatan WHERE is_deleted = 0 ORDER BY nama_kec ASC';
  connection.query(sql, callback);
};
