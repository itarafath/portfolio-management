import {
    Entity,
    PrimaryColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';
import { User } from './User';
import { Investment } from './Investment';

@Entity('portfolios')
@Index('idx_portfolios_user_id', ['userId'])
export class Portfolio {
    @PrimaryColumn('char', { length: 36 })
    id: string;

    @Column({ name: 'user_id', type: 'char', length: 36, nullable: false })
    userId: string;

    @ManyToOne(() => User, (user) => user.portfolios)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'varchar', length: 255, nullable: false })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ name: 'is_active', type: 'tinyint', width: 1, default: 1 })
    isActive: boolean;

    @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
    deletedAt: Date;

    @OneToMany(() => Investment, (investment) => investment.portfolio)
    investments: Investment[];

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;
}
