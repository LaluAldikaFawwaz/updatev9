import connection from '../db/dbconfig.js';

export const createSekolah = (data, callback) => {
  const sql = 'INSERT INTO sekolah (Nama_Sekolah, NPSN, Status, id_kec, is_deleted) VALUES (?, ?, ?, ?, 0)';
  connection.query(sql, [data.Nama_Sekolah, data.NPSN, data.Status, data.id_kec], callback);
};

export const getAllSekolah = (callback) => {
  const sql = 'SELECT * FROM data_sekolah';
  connection.query(sql, [], callback);
};

export const getfilterinner = (callback) => {
  const sql = `
    SELECT s.*, k.nama_kecamatan, k.id_kab, kb.nama_kab FROM data_sekolah s LEFT JOIN kecamatan k ON s.id_kec = k.id_kec LEFT JOIN kabupaten kb ON k.id_kab = kb.id_kab WHERE s.is_deleted = 0 ORDER BY s.No ASC;
  `;
  connection.query(sql, [], callback);
}

export const getSekolahById = (id, callback) => {
  const sql = 'SELECT * FROM data_sekolah WHERE No = ? AND is_deleted = 0';
  connection.query(sql, [id], callback);
};

export const updateSekolahById = (id, data, callback) => {
  const sql = 'UPDATE data_sekolah SET Nama_Sekolah = ?, NPSN = ?, Status = ?, id_kec = ? WHERE No = ? AND is_deleted = 0';
  connection.query(sql, [data.Nama_Sekolah, data.NPSN, data.Status, data.id_kec, id], callback);
};

export const deleteSekolahById = (id, callback) => {
  const sql = 'UPDATE data_sekolah SET is_deleted = 1 WHERE No = ?';
  connection.query(sql, [id], callback);
};

export const searchSekolah = (params, callback) => {
  let sql = 'SELECT s.*, k.nama_kec FROM data_sekolah s LEFT JOIN kecamatan k ON s.id_kec = k.id_kec WHERE s.is_deleted = 0';
  const values = [];

  if (params.search) {
    sql += ' AND (s.Nama_Sekolah LIKE ? OR s.NPSN LIKE ?)';
    values.push(`%${params.search}%`, `%${params.search}%`);
  }

  if (params.Status) {
    sql += ' AND s.Status = ?';
    values.push(params.Status);
  }

  if (params.id_kec) {
    sql += ' AND s.id_kec = ?';
    values.push(params.id_kec);
  }

  // Sorting
  const validColumns = ['Nama_Sekolah', 'NPSN', 'Status', 'id_kec'];
  const sortColumn = validColumns.includes(params.sortBy) ? params.sortBy : 'Nama_Sekolah';
  const sortOrder = params.sortOrder?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  sql += ` ORDER BY s.${sortColumn} ${sortOrder}`;

  connection.query(sql, values, callback);
};
