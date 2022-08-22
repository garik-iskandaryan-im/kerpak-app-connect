require('dotenv').config();

module.exports = {
    env: process.env.NODE_ENV,
    server: {
        port: 4003
    },
    sequelize: {
        host: process.env.DATABASE_HOST || 'localhost',
        dialect: 'mysql',
        database: process.env.DATABASE_NAME || 'kerpak',
        username: process.env.DATABASE_USERNAME || 'root',
        password: process.env.DATABASE_PASSWORD || 'root',
        logDBHost: process.env.LOG_DATABASE_HOST || 'localhost',
        logDBDialect: 'mysql',
        logDBName: process.env.LOG_DATABASE_NAME || 'kerpakLogs',
        logDBUsername: process.env.LOG_DATABASE_USERNAME || 'root',
        logDBPassword: process.env.LOG_DATABASE_PASSWORD || 'root',
    },
    s3: {
        KEY: process.env.S3_KEY,
        SECRET: process.env.S3_SECRET,
        SES: {
            REGION: process.env.S3_SES_REGION,
            SOURCE: process.env.S3_SES_SOURCE,
        }
    },
    client: {
        privateKeyPath: process.env.CLIENT_PRIVATE_KEY_PATH,
        secret: process.env.CLIENT_SECRET,
        mobileIps: process.env.MOBILE_IPS,
        publicKeyPathBLE: process.env.CLIENT_PUBLIC_KEY_PATH_BLE,
    },
    kerpakConnectClient: {
        privateKeyPath: process.env.KERPAK_CONNECT_CLIENT_PRIVATE_KEY_PATH,
        secret: process.env.KERPAK_CONNECT_CLIENT_SECRET,
    },
    TRAFFIC_SAVING: {
        INTERVAL: process.env.TRAFFIC_SAVING_INTERVAL,
        TIMEOUT: process.env.TRAFFIC_SAVING_TIMEOUT,
        INTERVAL_TEMPERATURE: process.env.TRAFFIC_SAVING_INTERVAL_TEMPERATURE,
        INTERVAL_DOOR: process.env.TRAFFIC_SAVING_INTERVAL_DOOR,
    },
};
