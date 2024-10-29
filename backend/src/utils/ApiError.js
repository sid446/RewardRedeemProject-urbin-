class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong", // It's good practice to capitalize the default message.
        errors = [],
        stack = "" // Corrected the parameter name to match usage
    ) {
        super(message);
        this.data = null;
        this.statusCode = statusCode;
        this.message = message;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack; // This line is now correctly checking the parameter 'stack'
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };
