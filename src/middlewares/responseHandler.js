// Generic response handler for all categories
const responseHandler = {
  success: (res, message, data = null, statusCode = 200) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      message,
      data
    }));
  },

  validationError: (res, errors, statusCode = 400) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: false,
      message: 'Validasi gagal',
      errors
    }));
  },

  notFound: (res, message = 'Data tidak ditemukan') => {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: false,
      message
    }));
  },

  serverError: (res, message = 'Terjadi kesalahan pada server') => {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: false,
      message
    }));
  }
};

export default responseHandler;
export const sendResponse = (res, statusCode, success, message, data = null) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        success,
        message,
        data
    }));
};

export const sendSuccess = (res, message, data = null, statusCode = 200) => {
    sendResponse(res, statusCode, true, message, data);
};

export const sendError = (res, message, statusCode = 400, data = null) => {
    sendResponse(res, statusCode, false, message, data);
};

export const sendValidationError = (res, errors, statusCode = 400) => {
    sendResponse(res, statusCode, false, 'Validasi gagal', { errors });
};

export const sendPaginatedResponse = (res, message, items, metadata, statusCode = 200) => {
    sendSuccess(res, message, {
        items,
        metadata
    }, statusCode);
};

export const sendJoinResponse = (res, message, data, statusCode = 200) => {
    sendSuccess(res, message, {
        kabupaten: {
            id_kab: data.id_kab,
            nama_kab: data.nama_kab
        },
        kecamatan: data.kecamatan ? {
            id_kec: data.kecamatan.id_kec,
            nama_kecamatan: data.kecamatan.nama_kecamatan
        } : null,
        sekolah: data.sekolah ? {
            nama_sekolah: data.sekolah.Nama_Sekolah,
            npsn: data.sekolah.NPSN,
            status: data.sekolah.Status
        } : null
    }, statusCode);
};