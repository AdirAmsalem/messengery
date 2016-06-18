'use strict';

const graphApi = require('./lib/graphApi');
const messengerApi = require('./lib/messengerApi');
const conversationFactory = require('./lib/conversationFactory');
const webhooksHandler = require('./lib/webhooksHandler');

const utils = require('./lib/utils');

const createBot = (app, options) => {
  const messageListeners = new Map();
  const postbackListeners = new Map();
  const conversations = new Map();

  const methods = {
    send(userId, message, delay) {
      if (delay) {
        setTimeout(() => messengerApi.sendMessage(options, userId, message), delay);
      } else {
        messengerApi.sendMessage(options, userId, message);
      }
    },
    on(input, handler) {
      messageListeners.set(input, handler);
    },
    handlePostback(type, handler) {
      postbackListeners.set(type, handler);
    },
    registerPostbackHandlers(handlerObjects) {
      Object.keys(handlerObjects).forEach(key => {
        this.handlePostback(key, handlerObjects[key]);
      });
    },
    setWelcomeScreenMessage(message) {
      messengerApi.setWelcomeScreenMessage(options, message);
    },
    startConversation(userId) {
      const conversation = conversationFactory.create(methods, userId);
      conversations.set(userId, conversation);
      return conversation;
    }
  };

  app.get(options.webhooksPath, (req, res) => {
    if (graphApi.isValidToken(req.query['hub.verify_token'], options.verifyToken)) {
      res.send(req.query['hub.challenge']);
    } else {
      res.send('Error, wrong validation token');
    }
  });

  app.post(`${options.webhooksPath}/`, (req, res) => {
    console.log(`Incoming request: ${JSON.stringify(req.body)}`);
    webhooksHandler.handle(methods, conversations, messageListeners, postbackListeners, req.body);
    res.sendStatus(200);
  });

  return methods;
};

module.exports = {
  createBot,
  utils
};
