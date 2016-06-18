'use strict';

const postbacksHandler = require('./postbacksHandler');
const messagesHandler = require('./messagesHandler');
const conversationsHandler = require('./conversationsHandler');

const handle = (bot, conversations, messageListeners, postbackListeners, body) => {
  const messagingEvents = body.entry[0].messaging;

  messagingEvents.forEach(event => {
    const userId = event.sender.id;

    let message = {};

    if (event.postback) {
      message = JSON.parse(event.postback.payload);
    } else if (event.message && event.message.text) {
      message = event.message;
    }

    const conversation = conversations.get(userId);
    if (conversation && conversation.isActive()) {
      return conversationsHandler.handle(bot, conversation, userId, message);
    }

    if (event.postback) {
      postbacksHandler.handle(bot, postbackListeners, userId, message);
    } else if (event.message && event.message.text) {
      messagesHandler.handle(bot, messageListeners, userId, message);
    }
  });
};

module.exports = {
  handle
};
