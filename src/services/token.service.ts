import jwt from 'jsonwebtoken'
import { prisma } from '~/prisma/'
import { IPayload } from '~/interfaces/IPayload'

export interface IGenerateTokens {
    accessToken: string
    refreshToken: string
}

class TokenService {
    generateTokens(payload: IPayload): IGenerateTokens {
        const accessToken: string = jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, { expiresIn: '1h' })
        const refreshToken: string = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: '24h' })
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token: string) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET!)
            return userData
        } catch (e) {
            return null
        }
    }

    validateRefreshToken(token: string) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET!)
            return userData
        } catch (e) {
            return null
        }
    }

    async saveToken(userId: number, refreshToken: string) {
        const tokenData = await prisma.token.findFirst({ where: { userId: userId } })
        if (tokenData) {
            return await prisma.token.updateMany({
                where: {
                    userId: userId
                },
                data: {
                    refreshToken: refreshToken
                }
            })
        }
        const token = await prisma.token.create({
            data: {
                userId: userId,
                refreshToken: refreshToken
            }
        })
        return token
    }
    async removeToken(refreshToken: string) {
        const token = await prisma.token.delete({
            where: {
                refreshToken: refreshToken
            }
        })
        return token
    }

    async findToken(refreshToken: string) {
        const token = await prisma.token.findFirst({
            where: {
                refreshToken: refreshToken
            }
        })
        return token
    }
}

export default new TokenService()
