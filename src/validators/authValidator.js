export function validateAuthData(data) {
    const errors = {};
    
    // Username validation
    if (!data.username) {
        errors.username = 'Username harus diisi';
    } else if (data.username.length < 3) {
        errors.username = 'Username minimal 3 karakter';
    } else if (data.username.length > 50) {
        errors.username = 'Username maksimal 50 karakter';
    }

    // Email validation
    if (!data.email) {
        errors.email = 'Email harus diisi';
    } else {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(data.email)) {
            errors.email = 'Format email tidak valid';
        }
    }

    // Password validation
    if (!data.password) {
        errors.password = 'Password harus diisi';
    } else if (data.password.length < 6) {
        errors.password = 'Password minimal 6 karakter';
    } else if (data.password.length > 100) {
        errors.password = 'Password maksimal 100 karakter';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}