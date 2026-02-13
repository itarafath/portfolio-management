import { DataSource } from 'typeorm';
import { config } from './index';
import {
    User,
    Portfolio,
    Investment,
    Transaction,
    RefreshToken,
    AssetType,
} from '../entities';

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: config.database.host,
    port: config.database.port,
    username: config.database.username,
    password: config.database.password,
    database: config.database.name,
    synchronize: config.nodeEnv === 'development',
    logging: config.nodeEnv === 'development',
    entities: [User, Portfolio, Investment, Transaction, RefreshToken, AssetType],
    migrations: ['src/migrations/*.ts'],
    subscribers: [],
});
