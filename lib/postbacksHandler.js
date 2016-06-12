const handle = (bot, listeners, userId, payload) => {
  const listener = listeners.get(payload.type);

  if (listener) {
    listener(bot, userId, payload.data);
  } else {
    const message = `Cannot handle postback: ${JSON.stringify(payload)}`;
    console.error(message);
    bot.send(userId, message);
  }
};

module.exports = {
  handle
};
