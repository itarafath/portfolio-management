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
import { Portfolio } from './Portfolio';
import { AssetType } from './AssetType';
import { Transaction } from './Transaction';

@Entity('investments')
@Index('idx_investments_symbol', ['symbol'])
@Index('idx_investments_portfolio_asset', ['portfolioId', 'assetTypeId'])
export class Investment {
    @PrimaryColumn('char', { length: 36 })
    id: string;

    @Column({ name: 'portfolio_id', type: 'char', length: 36, nullable: false })
    portfolioId: string;

    @ManyToOne(() => Portfolio, (portfolio) => portfolio.investments)
    @JoinColumn({ name: 'portfolio_id' })
    portfolio: Portfolio;

    @Column({ name: 'asset_type_id', type: 'int', nullable: true })
    assetTypeId: number;

    @ManyToOne(() => AssetType, (assetType) => assetType.investments)
    @JoinColumn({ name: 'asset_type_id' })
    assetType: AssetType;

    @Column({ type: 'varchar', length: 20, nullable: false })
    symbol: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    name: string;

    @Column({ type: 'decimal', precision: 18, scale: 8, nullable: false, default: 0 })
    quantity: number;

    @Column({
        name: 'average_purchase_price',
        type: 'decimal',
        precision: 18,
        scale: 2,
        nullable: false,
        default: 0,
    })
    averagePurchasePrice: number;

    @Column({
        name: 'current_price',
        type: 'decimal',
        precision: 18,
        scale: 2,
        nullable: true,
    })
    currentPrice: number;

    @Column({ type: 'varchar', length: 3, nullable: true })
    currency: string;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({ name: 'is_active', type: 'tinyint', width: 1, default: 1 })
    isActive: boolean;

    @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
    deletedAt: Date;

    @OneToMany(() => Transaction, (transaction) => transaction.investment)
    transactions: Transaction[];

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;
}
