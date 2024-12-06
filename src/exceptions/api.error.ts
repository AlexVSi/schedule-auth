class ApiError extends Error {
    status: any;
    errors: Array<string>;

    constructor(status: any, message: any, errors: Array<string> = []) {
        super(message)
        this.status = status
        this.errors = errors
    }

    static UnauthorizedError() {
        return new ApiError(401, 'Пользователь не авторизован')
    }

    static BadRequest(message: string, errors: Array<string> = []) {
        return new ApiError(401, message, errors )
    }
}

export default ApiError
