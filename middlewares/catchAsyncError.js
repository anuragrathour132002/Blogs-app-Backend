// Middleware to catch and handle errors from asynchronous functions
exports.catchAsyncErrors = (func) => (req, res, next) => {
    // Execute the asynchronous function and handle any errors
    // If the function throws an error, it's passed to the next middleware (usually the error handler)
    Promise.resolve(func(req, res, next)).catch(next);
};
