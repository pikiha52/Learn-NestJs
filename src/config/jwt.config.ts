import { JwtModuleOptions, JwtSignOptions } from "@nestjs/jwt";

export const jwtConfig: JwtModuleOptions = {
    secret: 's3Cr3Tn!h',
    signOptions: {
        expiresIn: 60,
    },
}

export const refreshTokenConfig: JwtSignOptions = {
    expiresIn: 3600 * 24,
}