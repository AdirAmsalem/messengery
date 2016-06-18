'use strict';

const findListener = (listeners, text) => {
  return Array.from(listeners.keys())
    .filter(key => {
      if (typeof key === 'string') {
        return key === text;
      } else if (key instanceof RegExp) {
        return key.test(text)
      }
      return false;
    })
    .map(key => {
      const message = {text};

      if (key instanceof RegExp) {
        message.matches = key.exec(text)
      }

      return {
        handler: listeners.get(key),
        message: message
      };
    })
    .pop();
};

const handle = (bot, listeners, userId, message) => {
  const listener = findListener(listeners, message.text);

  if (listener) {
    listener.handler(bot, userId, listener.message);
  } else {
    const errorMessage = `Cannot handle message: ${JSON.stringify(message.text)}`;
    console.error(errorMessage);
    bot.send(userId, errorMessage);
  }
};

module.exports = {
  handle
};
