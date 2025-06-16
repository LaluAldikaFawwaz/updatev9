const validateKabupatenData = (data) => {
    const errors = {};
    
    if (!data.nama_kab) {
        errors.nama_kab = 'Nama kabupaten wajib diisi';
    } else if (typeof data.nama_kab !== 'string') {
        errors.nama_kab = 'Nama kabupaten harus berupa text';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

const validateSearchQuery = (query) => {
    const errors = {};
    
    if (!query.nama_kab || query.nama_kab.trim() === '') {
        errors.nama_kab = 'Parameter pencarian nama kabupaten wajib diisi';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export {
    validateKabupatenData,
    validateSearchQuery
};