const errorHandler = (err, req, res, next) => {
    // 1. Determinar el código de estado (si no está, es 500)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);

    // 2. Responder con JSON
    res.json({
        msg: err.message,
        // En desarrollo, mostramos el stack para depuración
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = {
    errorHandler,
};