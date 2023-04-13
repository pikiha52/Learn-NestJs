import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/config/jwt.config';
import { AuthenticationController } from './authentication.controller';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entity/refresh-token.entity';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [JwtModule.register(jwtConfig), UsersModule, TypeOrmModule.forFeature([RefreshToken])],
  providers: [AuthenticationService, JwtStrategy],
  controllers: [AuthenticationController]
})
export class AuthenticationModule {
}
