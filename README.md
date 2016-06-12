# Messengery
Messengery is a simple framework for creating Messenger bots.

## Getting started
1. Install: `npm install --save messengery`
2. Require "messengery" and create your bot:
```javascript
const config = require('config');
const express = require('express');
const bodyParser = require('body-parser');
const Messengery = require('messengery');

const app = express();
app.use(bodyParser.json());
app.set('port', (process.env.PORT || config.get('app.defaultPort')));
app.listen(app.get('port'), () => console.log(`App is listening on port ${app.get('port')}!`));
  
const bot = Messengery.createBot(app, {
  pageId: config.get('facebook.pageId'),
  accessToken: config.get('facebook.accessToken'),
  verifyToken: config.get('facebook.verifyToken'),
  webhooksPath: config.get('facebook.webhooksPath'),
  graphApiUrl: config.get('facebook.graphApiUrl')
});

// your bot is alive!
```

## API
TBD

## Example
```javascript
const config = require('config');
const express = require('express');
const bodyParser = require('body-parser');

const categoriesService = require('./services/categoriesService');
const productsService = require('./services/productsService');

const categoriesPostbacks = require('./postbacks/categoriesPostbacks');
const productsPostbacks = require('./postbacks/productsPostbacks');

const Messengery = require('messengery');

const app = express();
app.use(bodyParser.json());
app.set('port', (process.env.PORT || config.get('app.defaultPort')));
app.listen(app.get('port'), () => console.log(`App is listening on port ${app.get('port')}!`));

const bot = Messengery.createBot(app, {
  pageId: config.get('facebook.pageId'),
  accessToken: config.get('facebook.accessToken'),
  verifyToken: config.get('facebook.verifyToken'),
  webhooksPath: config.get('facebook.webhooksPath'),
  graphApiUrl: config.get('facebook.graphApiUrl')
});

bot.registerPostbackHandlers(categoriesPostbacks);
bot.registerPostbackHandlers(productsPostbacks);

bot.on('hello', (bot, userId) => {
  bot.send(userId, `Hello my friend!`);
});

bot.on(/my name is (\w+)( and I live in (.+))?/, (bot, userId, message) => {
  bot.send(userId, `Nice to meet you ${message.matches[1]}!`);

  if (message.matches[3]) {
    bot.send(userId, `${message.matches[3]} is a beautiful place, I hope you enjoy the sun`, 1500);
  }
});

categoriesService.load(() => {
  productsService.load(() => {
    bot.setWelcomeScreenMessage(categoriesService.buildSelectCategoryMessage());
  });
});
```
