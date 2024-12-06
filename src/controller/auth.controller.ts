import { Request, Response, NextFunction } from 'express'
import authService from '../services/auth.service'


class AuthController {
    async registration(req: Request, res: Response, next: NextFunction) {
        try {
            const tokens = await authService.registration(req.body)
            res.cookie('refreshToken', tokens.refreshToken, { maxAge: 3600000, httpOnly: true, secure: true, sameSite: 'none', partitioned: true })
            return res.json(tokens)
        } catch (e) {
            next(e)
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const tokens = await authService.login(req.body.email, req.body.password)
            res.cookie('refreshToken', tokens.refreshToken, { maxAge: 3600000, httpOnly: true, secure: true, sameSite: 'none', partitioned: true })
            return res.json(tokens)
        } catch(e) {
            next(e)
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            console.log(req.cookies)
            const { refreshToken } = req.cookies
            const token = await authService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json(token)
        } catch (e) {
            next(e);
        }
    }

    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.cookies
            const tokens = await authService.refresh(refreshToken)
            res.cookie('refreshToken', tokens.refreshToken, { maxAge: 3600000, httpOnly: true, secure: true, sameSite: 'none', partitioned: true })
            return res.json(tokens)
        } catch (e) {
            next(e)
        }
    }
}

export default new AuthController()
