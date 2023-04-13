import { Controller, Body, HttpStatus, Post, Res, Patch, Param, UseGuards } from '@nestjs/common';
import { AuthDto } from './dto/auth-dto';
import { Response } from 'express';
import { AuthenticationService } from './authentication.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtGuard } from 'src/guard/jwt.guard';
import { GetUser } from './get-user.decorator';
import { User } from 'src/users/entity/user.entity';

@Controller('authentication')
export class AuthenticationController {
    constructor(
        private authService: AuthenticationService
    ) {}

    @Post()
    async signin(@Body() loginDto: AuthDto, @Res() res: Response) {
        let request = await this.authService.login(loginDto)
        res.status(HttpStatus.OK).json({
            code: HttpStatus.OK,
            response: request
        })
    }

    @Post('refresh-token')
    async refreshToken(@Body() refreshTokenDto: RefreshTokenDto, @Res() res: Response) {
        let request = await this.authService.refreshTokenService(refreshTokenDto)
        res.status(HttpStatus.ACCEPTED).json({
            code: HttpStatus.ACCEPTED,
            response: request
        })
    }

    @Patch('/:id/revoke')
    @UseGuards(JwtGuard)
    async revokeToken(@Param('id') id: string, @Res() res: Response) {
        let request = await this.authService.revokeTokenUser(id)
        res.status(HttpStatus.OK).json({
            code: HttpStatus.OK,
        })
    }
}
