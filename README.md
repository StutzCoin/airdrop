# Stutz Airdrop 

[![Build Status](https://travis-ci.org/StutzCoin/airdrop.svg?branch=master)](https://travis-ci.org/StutzCoin/airdrop)

# How it is working

1. Users use an online "Form A" where he can enter their Name, First Name, Email, Phone number and LTC address. 
   * Data are written to a Google Sheet tables for auditing (typeform configuration)
   * Data are synchronized to this backend module database (sequelize ORM + any database is supported).
   
2. System regularly check for valid user data (email valid, phone number swiss, LTC adress valid). For validating email address, it send: 
   * an email link with expiry time that redirect user to another "Form B" (config.email.formUrl). 
   * an error message if his phone is not a valid swiss number , or not a valid LTC address (mainnet not testnet).
   
3. System regularly check for valid user with validated email. For validating Phone number, it send: 
   * sms link with expiry time that redirect user to another "Form C" (config.sms.formUrl). 
   * error message to user if his Phone is not a valid swiss number.
      
All URL send to user through email/sms are unique for each user, contains a UUID v5 that is prefilled in every form B/C using Type-Form hidden field.

```
Form A               |                  |    Form B             |                | Form C               |
Name         [     ] |                  | Email code   [      ] |                | SMS code    [      ] |
First Name   [     ] | -> send email -> |                       | -> send SMS -> |                      |
Email        [     ] |                  |                       |                |                      |
Phone Number [     ] |                  |                       |                |                      |
LTC Address  [     ] |                  |                       |                |                      |
```

## typeform.com
This module require typeform.com pro features "hidden fields"

# Overview

Users register their data using multiple Form (typeform.com), data are synchronized into a Google Sheet

This NodeJS module run multiple asynchronous processes using PM2

* Users data get imported every minutes (importProcess.js) in sqlite3/mysql
* Users data marked as New are validated (qualityProcess.js)
* If Users email is valid, a validation email is sent to user (emailProcess.js)
* If Users email is validated, a validation SMS is sent to user (smsProcess.js)

# development
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
