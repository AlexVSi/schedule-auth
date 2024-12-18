import { Request, Response, NextFunction } from "express"
import ApiError from "~/exceptions/api.error"
import tokenService from "~/services/token.service"

interface IRequest extends Request {
    user?: any;
}

const auth = (req: IRequest, res: Response, next: NextFunction) => {
    try {
        const autorizationHeader = req.headers.authorization
        if (!autorizationHeader) {
            return next(ApiError.UnauthorizedError())
        }

        const accessToken = autorizationHeader
        if (!accessToken) {
            return next(ApiError.UnauthorizedError())
        }

        const userData = tokenService.validateAccessToken(accessToken)
        if (!userData) {
            return next(ApiError.UnauthorizedError())
        }

        req.user = userData
        next()
    } catch (e) {
        return next(ApiError.UnauthorizedError())
    }
}

export { auth }
