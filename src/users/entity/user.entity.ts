import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { RefreshToken } from "src/authentication/entity/refresh-token.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    username: string;

    @Column()
    salt: string;

    @Column()
    password: string;

    @OneToMany(() => RefreshToken, (refreshTokens) => refreshTokens.user, {
        eager: true
    })
    refreshTokens: RefreshToken[]

    async validatePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password
    }
}