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
        data: {
            formUrl: "https://cdricwalter.typeform.com/to/bhypWc",
        },
        sms: {
            accountSid: 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
            authToken: 'your_auth_token',
            number: 'phone?number',
            expireInMinutes: 15,
            formUrl: "https://cdricwalter.typeform.com/to/RNvI6l",
            regionAllowed: 'CH'
        },
        email: {
            host: 'localhost',
            port: 425,
            secure: false,
            auth: {
                user: 'stutz@gmail.com',
                pass: 'xxxxxxxxxx'
            },
            from: "stutzbot@gmail.com",
            expireInMinutes: 15,
            formUrl: "https://cdricwalter.typeform.com/to/mLte7Q",
        },
        coin: {
            home: "'http://xxxxxxx.com/"
        },
        import: {
            port: 3000,
        },
        locales: ['en', 'de', 'fr', 'it'],
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
