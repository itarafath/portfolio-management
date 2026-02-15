import { AppDataSource } from './config/database';
import { config } from './config';
import app from './app';

// Initialize database and start server
AppDataSource.initialize()
    .then(() => {
        console.log('Database connected successfully');

        app.listen(config.port, () => {
            console.log(`Server running on port ${config.port}`);
            console.log(`Environment: ${config.nodeEnv}`);
        });
    })
    .catch((error) => {
        console.error('Database connection failed:', error);
        process.exit(1);
    });
