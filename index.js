const graphApi = require('./lib/graphApi');
const messengerApi = require('./lib/messengerApi');
const postbacksHandler = require('./lib/postbacksHandler');
const messagesHandler = require('./lib/messagesHandler');

const utils = require('./lib/utils');

const createBot = (app, options) => {
  const messageListeners = new Map();
  const postbackListeners = new Map();

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

    const messagingEvents = req.body.entry[0].messaging;
    messagingEvents.forEach(event => {
      const userId = event.sender.id;

      if (event.postback) {
        const payload = JSON.parse(event.postback.payload);
        postbacksHandler.handle(methods, postbackListeners, userId, payload);

      } else if (event.message && event.message.text) {
        const text = event.message.text;
        messagesHandler.handle(methods, messageListeners, userId, text);
      }
    });

    res.sendStatus(200);
  });

  return methods;
};

module.exports = {
  createBot,
  utils
};
