import 'reflect-metadata';
import { AppDataSource } from '../config/database';
import { AssetType } from '../entities';

const assetTypes = [
    { name: 'Stocks', description: 'Publicly traded company shares' },
    { name: 'Bonds', description: 'Government or corporate debt securities' },
    { name: 'ETF', description: 'Exchange-traded funds tracking indexes or sectors' },
    { name: 'Mutual Fund', description: 'Professionally managed pooled investment fund' },
    { name: 'Cryptocurrency', description: 'Digital or virtual currencies' },
    { name: 'Real Estate', description: 'Property or REIT investments' },
    { name: 'Commodity', description: 'Physical goods like gold, oil, or agricultural products' },
    { name: 'Options', description: 'Derivative contracts for buying/selling assets' },
    { name: 'Forex', description: 'Foreign currency exchange trading' },
    { name: 'Other', description: 'Other investment types' },
];

async function seed() {
    try {
        await AppDataSource.initialize();
        console.log('Database connected');

        const repo = AppDataSource.getRepository(AssetType);
        const existing = await repo.count();

        if (existing > 0) {
            console.log(`Asset types already seeded (${existing} found). Skipping.`);
        } else {
            for (const at of assetTypes) {
                const entity = repo.create(at);
                await repo.save(entity);
            }
            console.log(`Seeded ${assetTypes.length} asset types`);
        }

        await AppDataSource.destroy();
        console.log('Done');
    } catch (error) {
        console.error('Seed failed:', error);
        process.exit(1);
    }
}

seed();
