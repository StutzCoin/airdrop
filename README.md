# Stutz Airdrop 

[![Build Status](https://travis-ci.org/StutzCoin/airdrop.svg?branch=master)](https://travis-ci.org/StutzCoin/airdrop)

# How it is working

1. Users visit a page and land in a first online "Form A" where they can enter their Name, First Name, Email, LTC adress
2. System send either 
   * confirmation email to user with a Link that redirect user to another "Form B", for entering the email validation number.
   * error message to user if his email is not a valid swiss number , not a valid LTC address.
3. System send either 
   * confirmation SMS to user with a link/registration to a "Form C", for entering the SMS validation number.. Request from user is accepted.
   * error message to user if his email is not a valid swiss number , not a valid LTC address.

```
Form A               |                  |    Form B             |                | Form C               |
Name         [     ] |                  | Email code   [      ] |                | SMS code    [      ] |
First Name   [     ] | -> send email -> |                       | -> send SMS -> |                      |
Email        [     ] |                  |                       |                |                      |
Phone Number [     ] |                  |                       |                |                      |
LTC Address  [     ] |                  |                       |                |                      |
```

# Overview

Users register their data using multiple Form (typeform.com), data are synchronized into a Google Sheet

This NodeJS module run multiple asynchronous processes using PM2

* Users data get imported every minutes (importProcess.js) in sqlite3/mysql
* Users data marked as New are validated (qualityProcess.js)
* If Users email is valid, a validation email is sent to user (emailProcess.js)
* If Users email is validated, a validation SMS is sent to user (smsProcess.js) that need to be entered in the next 15min at url config.checkCodeUrl and submitted

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
