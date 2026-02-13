import {
    Entity,
    PrimaryColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    Index,
} from 'typeorm';
import { Investment } from './Investment';

export enum TransactionType {
    BUY = 'buy',
    SELL = 'sell',
}

@Entity('transactions')
@Index('idx_transactions_date', ['transactionDate'])
@Index('idx_transactions_investment_id', ['investmentId'])
export class Transaction {
    @PrimaryColumn('char', { length: 36 })
    id: string;

    @Column({ name: 'investment_id', type: 'char', length: 36, nullable: false })
    investmentId: string;

    @ManyToOne(() => Investment, (investment) => investment.transactions)
    @JoinColumn({ name: 'investment_id' })
    investment: Investment;

    @Column({
        name: 'transaction_type',
        type: 'varchar',
        length: 10,
        nullable: false,
    })
    transactionType: TransactionType;

    @Column({ type: 'decimal', precision: 18, scale: 8, nullable: false })
    quantity: number;

    @Column({
        name: 'price_per_unit',
        type: 'decimal',
        precision: 18,
        scale: 2,
        nullable: false,
    })
    pricePerUnit: number;

    @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
    fees: number;

    @Column({
        name: 'transaction_date',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    transactionDate: Date;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;
}
