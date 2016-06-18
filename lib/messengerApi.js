'use strict';

const graphApi = require('./graphApi');

const _normalizeMessage = message => {
  return typeof message === 'string' ? {text: message} : message;
};

const sendMessage = (config, recipientId, message) => {
  const recipient = {id: recipientId};
  const normalizedMessage = _normalizeMessage(message);

  graphApi.sendMessage(config, recipient, normalizedMessage);
};

const setWelcomeScreenMessage = (config, message) => {
  const normalizedMessage = _normalizeMessage(message);
  const settings = {
    setting_type: 'call_to_actions',
    thread_state: 'new_thread',
    call_to_actions: [{message: normalizedMessage}]
  };

  graphApi.threadSettings(config, settings);
};

module.exports = {
  sendMessage,
  setWelcomeScreenMessage
};
