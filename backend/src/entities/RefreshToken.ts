import {
    Entity,
    PrimaryColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    Index,
} from 'typeorm';
import { User } from './User';

@Entity('refresh_tokens')
@Index('idx_refresh_tokens_expires_at', ['expiresAt'])
@Index('idx_refresh_tokens_user_id', ['userId'])
export class RefreshToken {
    @PrimaryColumn('char', { length: 36 })
    id: string;

    @Column({ name: 'user_id', type: 'char', length: 36, nullable: false })
    userId: string;

    @ManyToOne(() => User, (user) => user.refreshTokens)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'varchar', length: 500, unique: true, nullable: false })
    token: string;

    @Column({ name: 'expires_at', type: 'timestamp', nullable: false })
    expiresAt: Date;

    @Column({ type: 'tinyint', width: 1, default: 0, nullable: true })
    revoked: boolean;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;
}
