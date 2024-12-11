import { prisma } from '~/prisma'
import bcrypt from 'bcryptjs'
import tokenService from './token.service'
import ApiError from '~/exceptions/api.error'
import { IUser } from '~/interfaces/IUser'

class AuthService {
    async registration(body: Omit<IUser, 'id'>) {
        const duplicate = await prisma.auth.findFirst({ where: { login: body.login } })
        if (duplicate) {
            throw ApiError.BadRequest(`Пользователь с адресом ${body.login} уже существует`)
        }
        const hashPassword = bcrypt.hashSync(body.password, 5)

        const user = await prisma.auth.create({
            data: {
                login: body.login,
                password: hashPassword
            }
        })
        const tokens = tokenService.generateTokens({id: user.id, login: user.login})
        await tokenService.saveToken(user.id, tokens.refreshToken)
        return tokens
    }

    async login(login: string, password: string) {
        const user = await prisma.auth.findFirst({
            where: { login: login }
        })
        if (!user) {
            throw ApiError.BadRequest('Пользователь не найден')
        }
        const validPassword = bcrypt.compareSync(password, user.password)
        if (!validPassword) {
            throw ApiError.BadRequest('Неверный пароль')
        }
        const tokens = tokenService.generateTokens({id: user.id, login: user.login})
        await tokenService.saveToken(user.id, tokens.refreshToken)
        return tokens
    }

    async logout(refreshToken: string) {
        const token = await tokenService.removeToken(refreshToken)
        return token
    }

    async refresh(refreshToken: string) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError()
        }
        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError()
        }
        const user = await prisma.auth.findUnique({
            where: {
                id: (<any>userData).id
            }
        })
        if (!user) {
            throw ApiError.BadRequest('Пользователь не найден')
        }

        const tokens = tokenService.generateTokens({id: user.id, login: user.login})
        await tokenService.saveToken(user.id, tokens.refreshToken)
        return tokens
    }
}

export default new AuthService()
