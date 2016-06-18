'use strict';

const handle = (bot, listeners, userId, payload) => {
  const listener = listeners.get(payload.type);

  if (listener) {
    listener(bot, userId, payload.data);
  } else {
    const errorMessage = `Cannot handle postback: ${JSON.stringify(payload)}`;
    console.error(errorMessage);
    bot.send(userId, errorMessage);
  }
};

module.exports = {
  handle
};
