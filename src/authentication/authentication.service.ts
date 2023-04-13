import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth-dto';
import { LoginResponse } from './interface/login-response.interface';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './entity/refresh-token.entity';
import { Repository } from 'typeorm';
import { refreshTokenConfig } from 'src/config/jwt.config';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class AuthenticationService {
    constructor(
        private jwtService: JwtService,
        private userService: UsersService,
        @InjectRepository(RefreshToken)
        private readonly refreshTokenRepository: Repository<RefreshToken>
    ) { }

    async login(authDto: AuthDto): Promise<LoginResponse> {
        const { username, password } = authDto

        const user = await this.userService.validateUsers(username, password)
        
        if (!user) {
            throw new UnauthorizedException('Invalid username or password')
        }

        const access_token = await this.createAccessToken(user)
        const refresh_token = await this.createRefreshToken(user)
        return { access_token, refresh_token } as LoginResponse
    }

    async refreshTokenService(refreshTokenDto: RefreshTokenDto): Promise<{ access_token: string }> {
        const { refresh_token } = refreshTokenDto
        const payload = await this.decodeToken(refresh_token)
        const refreshToken = await this.refreshTokenRepository.findOne(
            {
                where: { id: payload.id },
                relations: ['user']
            }
        )

        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token is not found');
        }

        if (refreshToken.isRevoked) {
            throw new UnauthorizedException('Refresh token has beed revoked');
        }

        const access_token = await this.createAccessToken(refreshToken.user)
        return { access_token }
    }

    async decodeToken(token: string): Promise<any> {
        try {
            return await this.jwtService.verifyAsync(token)
        } catch (err) {
            if (err instanceof TokenExpiredError) {
                throw new UnauthorizedException('Refresh token is expired')
            } else {
                throw new InternalServerErrorException('Decode failed')
            }
        }
    }

    async createAccessToken(user: User): Promise<string> {
        const payload = {
            sub: user.id
        }
        const access_token = await this.jwtService.signAsync(payload)
        return access_token
    }

    async createRefreshToken(user: User): Promise<string> {
        const refreshToken = this.refreshTokenRepository.create();
        refreshToken.user = user
        refreshToken.isRevoked = false
        const expiredAt = new Date()
        expiredAt.setTime(expiredAt.getTime())
        refreshToken.expiredAt = expiredAt
        await refreshToken.save()

        const payload = {
            jid: refreshToken.id
        }

        const refresh_token = await this.jwtService.signAsync(payload, refreshTokenConfig)

        return refresh_token
    }

    async revokeTokenUser(id: string): Promise<void> {
        const refreshToken = await this.refreshTokenRepository.findOne({
            where: { id: id}
        })

        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token is not found')
        }

        refreshToken.isRevoked = true
        await refreshToken.save()
    }
}
