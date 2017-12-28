module.exports = {
    development: {
        dialect: "sqlite",
        storage: "./db.development.sqlite",
        readLimit: 500,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        networkType: 'testnet',
    },
    test: {
        dialect: "sqlite",
        storage: ":memory:"
    },
    production: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOSTNAME,
        dialect: 'sqlite',
        networkType: '',
    }
};
