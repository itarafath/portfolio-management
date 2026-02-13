import {
    Entity,
    PrimaryColumn,
    Column,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Portfolio } from './Portfolio';
import { RefreshToken } from './RefreshToken';

@Entity('users')
export class User {
    @PrimaryColumn('char', { length: 36 })
    id: string;

    @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
    email: string;

    @Column({ name: 'password_hash', type: 'varchar', length: 255, nullable: false })
    passwordHash: string;

    @Column({ name: 'first_name', type: 'varchar', length: 100, nullable: true })
    firstName: string;

    @Column({ name: 'last_name', type: 'varchar', length: 100, nullable: true })
    lastName: string;

    @OneToMany(() => Portfolio, (portfolio) => portfolio.user)
    portfolios: Portfolio[];

    @OneToMany(() => RefreshToken, (token) => token.user)
    refreshTokens: RefreshToken[];

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;
}
