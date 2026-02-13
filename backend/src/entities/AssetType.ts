import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
} from 'typeorm';
import { Investment } from './Investment';

@Entity('asset_types')
export class AssetType {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @OneToMany(() => Investment, (investment) => investment.assetType)
    investments: Investment[];

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;
}
