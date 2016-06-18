'use strict';

const create = (bot, userId) => {
  const context = {};
  const items = [];
  let isActive = true;
  let onEndCb;

  const methods = {
    context,
    send(message) {
      bot.send(userId, message);
    },
    ask(question, cb) {
      const item = {question, cb};
      items.push(item);

      if (items.length === 1) {
        bot.send(userId, item.question);
      }
    },
    isActive() {
      return isActive;
    },
    end() {
      if (isActive) {
        isActive = false;
        onEndCb && onEndCb(methods)
      }
    },
    _onEvent(event) {
      if (items.length > 0) {
        const item = items[0];
        item.cb(methods, event);
      }
    },
    next() {
      items.shift();

      if (items.length > 0) {
        const item = items[0];
        bot.send(userId, item.question);
      } else {
        methods.end();
      }
    },
    onEnd(cb) {
      onEndCb = cb;
    }
  };

  return methods;
};

module.exports = {
  create
};
