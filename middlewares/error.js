exports.generatedErrors = (err, req, res, next) => {
    // Set the status code for the response, defaulting to 500 (Internal Server Error) if not provided
    const statusCode = err.statusCode || 500;

    // Check if the error is a MongoDB server error related to duplicate keys
    if (err.name === 'MongoServerError' && err.message.includes('E11000 duplicate key')) {
        // Customize the error message to indicate that the email is already registered
        err.message = `${err.keyValue.email} is already registered`;
    }

    // Send the error response with the status code, message, and name of the error
    res.status(statusCode).json({
        message: err.message, // The custom or default error message
        errorname: err.name,  // The name/type of the error

        // Uncomment the line below to include the stack trace in the response (useful for debugging)
        // stack: err.stack
    });
};
