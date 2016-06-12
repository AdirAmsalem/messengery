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

const handle = (bot, listeners, userId, text) => {
  const listener = findListener(listeners, text);

  if (listener) {
    listener.handler(bot, userId, listener.message);
  } else {
    const message = `Cannot handle message: ${JSON.stringify(text)}`;
    console.error(message);
    bot.send(userId, message);
  }
};

module.exports = {
  handle
};
