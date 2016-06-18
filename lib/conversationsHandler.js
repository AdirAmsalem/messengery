'use strict';

const handle = (bot, conversation, userId, message) => {
  conversation._onEvent(message);
};

module.exports = {
  handle
};
