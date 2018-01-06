# Stutz Airdrop 

[![Build Status](https://travis-ci.org/StutzCoin/airdrop.svg?branch=master)](https://travis-ci.org/StutzCoin/airdrop)

# How it is working

1. Users use an online "Form A" for entering their Name, First Name, Email, Phone number and LTC address. 
   * Data are written to a Google Sheet tables for auditing (typeform configuration)
   * Data are synchronized to this backend module database using typeform webhook (and nodejs sequelize ORM + any database).
   
2. System regularly validate user data in database
   * Email valid, swiss phone number, LTC address valid (mainnet not testnet)
   
3. System regularly check for validated user data. For validating email address, it send: 
   * an email link with expiry time that redirect user to another "Form B" (config.email.formUrl). 
   * an error message if his phone is not a valid swiss number , or not a valid LTC address (mainnet not testnet).
 
 -> user need to confirm his email address by clicking in email link and validating B form.
   
3. System regularly check for valid user with validated email. For validating Phone number, it send: 
   * asms link with expiry time that redirect user to another "Form C" (config.sms.formUrl). 
   * error message to user if his Phone is not a valid swiss number.
    
 -> user need to confirm his swiss phone number by clicking in SMS the link and validating C form.
       
All URL send to user through email/sms are unique for each user, contains a UUID v5 that is prefilled in every form B/C using Type-Form hidden field.

```
Form A               |                  |    Form B             |                | Form C               |
Name         [     ] |                  | Email code   [      ] |                | SMS code    [      ] |
First Name   [     ] | -> send email -> |                       | -> send SMS -> |                      |
Email        [     ] |                  |                       |                |                      |
Phone Number [     ] |                  |                       |                |                      |
LTC Address  [     ] |                  |                       |                |                      |
```

## email templates
* are located in /templates and use PUG (also known as Jade)
* translations are done using i18n, json file in /locales

## www.twilio.com
This module send SMS using Twilio: a Cloud communications platform for building SMS, Voice & Messaging applications on an API built for global scale. 
Price: pay as you use Starting at $0.0075 / SMS

You can configure Twilio in config.js
```
sms: {
    accountSid: 'xxxxx',
    authToken: 'xxxxx',
    number: 'xxxxx',
},
```

## www.typeform.com
This module 
* require typeform.com pro features "hidden fields" (https://www.typeform.com/help/hidden-fields/)
* It use webhook (https://www.typeform.com/help/webhooks/) to get data as soon as forms are completed.
* Localization https://www.typeform.com/help/multi-language-typeforms/
Price: 25$ / Month

# Validations
* if phone is not from Switzerland and email is valid, an error email is sent to user 'error-phone.pug'
* if wallet is invalid and email is valid, an error email is sent to user 'error-wallet.pug'

# Audit / Support
You can see audit logs of a single user like this `yarn run audit FirstName LastName`
e.g.
```
yarn run audit jane doe
```
### Import

#### start server side webhook
```
node src/process/importProcess.js
```

#### testing
Simulate Typeform calling back your server
start server side webhook and see how to simulate call with curl from test/fixtures/readme.md

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
