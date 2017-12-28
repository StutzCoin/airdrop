# Stutz Airdrop 

# Overview

Users can register their data using a Form (typeform.com), data are synchronized into a Google Sheet

This NodeJS module run multile asynchronous processes using PM2

* Users data get imported every minutes (importProcess.js) in sqlite3/mysql
* Users data marked as New are validated (qualityProcess.js)
* If Users data are valid, a SMS code challenge is generated that user need to enter into (another?) form


## Starting App

Without Migrations
```
yarn install
yarn run install-global

# init database
node bin/init-database.js

# start PM2
yarn run start
```

## With Migrations
```
yarn install
yarn run install-global
node_modules/.bin/sequelize db:migrate

# start PM2
yarn run start
```
This will start the application and create an sqlite database in your app dir.

# Tests
```
yarn run test
```

or use intelliJ launcher


# Main Dependencies
https://www.npmjs.com/package/csv
https://www.npmjs.com/package/pm2
https://www.npmjs.com/package/pug
