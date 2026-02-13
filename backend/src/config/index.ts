import dotenv from 'dotenv';
dotenv.config();

export const config = {
    // Server
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',

    // Database
    database: {
        host: process.env.DATABASE_HOST || 'localhost',
        port: parseInt(process.env.DATABASE_PORT || '3306', 10),
        username: process.env.DATABASE_USERNAME || 'root',
        password: process.env.DATABASE_PASSWORD || 'developer',
        name: process.env.DATABASE_NAME || 'portfolio_db',
    },

    // JWT
    jwt: {
        secret: process.env.JWT_SECRET || 'arafath-secret-key',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    },

    // CORS
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    },
};
