const validateKecamatanData = (data) => {
    const errors = {};
    
    // Validasi nama_kecamatan
    if (!data.nama_kecamatan) {
        errors.nama_kecamatan = 'Nama kecamatan wajib diisi';
    } else if (typeof data.nama_kecamatan !== 'string') {
        errors.nama_kecamatan = 'Nama kecamatan harus berupa teks';
    } else if (data.nama_kecamatan.trim().length === 0) {
        errors.nama_kecamatan = 'Nama kecamatan tidak boleh kosong';
    }
    
    // Validasi id_kab
    if (!data.id_kab) {
        errors.id_kab = 'ID kabupaten wajib diisi';
    } else if (isNaN(data.id_kab) || !Number.isInteger(Number(data.id_kab))) {
        errors.id_kab = 'ID kabupaten harus berupa angka bulat';
    }
    
    // Validasi id_kec (untuk update)
    if (data.id_kec !== undefined) {
        if (isNaN(data.id_kec) || !Number.isInteger(Number(data.id_kec))) {
            errors.id_kec = 'ID kecamatan harus berupa angka bulat';
        }
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export {
    validateKecamatanData
};