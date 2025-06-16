const validateSekolahData = (data) => {
    const errors = {};
    
    if (!data.Nama_Sekolah) {
        errors.Nama_Sekolah = 'Nama sekolah wajib diisi';
    }
    
    if (!data.NPSN) {
        errors.NPSN = 'NPSN wajib diisi';
    }
    
    if (!data.Status) {
        errors.Status = 'Status wajib diisi';
    }
    
    if (!data.id_kec) {
        errors.id_kec = 'ID kecamatan wajib diisi';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export {
    validateSekolahData
};