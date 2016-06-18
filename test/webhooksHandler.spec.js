'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');

const messagesHandler = require('../lib/messagesHandler');
const postbacksHandler = require('../lib/postbacksHandler');
const conversationsHandler = require('../lib/conversationsHandler');
const conversationFactory = require('../lib/conversationFactory');

const webhooksHandler = require('../lib/webhooksHandler');

describe('webhooksHandler', () => {
  let sandbox;
  let bot;
  let conversations;
  let messageListeners;
  let postbackListeners;

  const userId = 'userId';

  const bodyWithMessage = {
    entry: [{
      messaging: [{
        sender: {id: userId},
        message: {text: 'hello'}
      }]
    }]
  };

  const bodyWithPostback = {
    entry: [{
      messaging: [{
        sender: {id: userId},
        postback: {payload: JSON.stringify({type: 'TYPE', data: {}})}
      }]
    }]
  };

  beforeEach(() => {
    sandbox = sinon.sandbox.create();

    bot = {send: sandbox.spy()};
    sandbox.spy(messagesHandler, 'handle');
    sandbox.spy(postbacksHandler, 'handle');
    sandbox.spy(conversationsHandler, 'handle');

    conversations = new Map();
    messageListeners = new Map();
    postbackListeners = new Map();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should handle message', () => {
    webhooksHandler.handle(bot, conversations, messageListeners, postbackListeners, bodyWithMessage);
    const message = bodyWithMessage.entry[0].messaging[0].message;
    expect(messagesHandler.handle.calledWith(bot, messageListeners, userId, message)).to.be.ok;
  });

  it('should handle postback', () => {
    webhooksHandler.handle(bot, conversations,messageListeners, postbackListeners, bodyWithPostback);
    const message = JSON.parse(bodyWithPostback.entry[0].messaging[0].postback.payload);
    expect(postbacksHandler.handle.calledWith(bot, postbackListeners, userId, message)).to.be.ok;
  });

  it('should handle conversation', () => {
    const conversation = conversationFactory.create();
    conversations.set(userId, conversation);

    webhooksHandler.handle(bot, conversations, messageListeners, postbackListeners, bodyWithMessage);

    const message = bodyWithMessage.entry[0].messaging[0].message;
    expect(conversationsHandler.handle.calledWith(bot, conversation, userId, message)).to.be.ok;
  });

  it('should not pass messages to inactive conversation', () => {
    const message = bodyWithMessage.entry[0].messaging[0].message;

    const conversation = conversationFactory.create();
    conversation.end();
    conversations.set(userId, conversation);

    webhooksHandler.handle(bot, conversations, messageListeners, postbackListeners, bodyWithMessage);

    expect(conversationsHandler.handle.notCalled).to.be.ok;
    expect(messagesHandler.handle.calledWith(bot, messageListeners, userId, message)).to.be.ok;
  });

  it('should not handle messages and postbacks when in conversation', () => {
    const conversation = conversationFactory.create();
    conversations.set(userId, conversation);

    webhooksHandler.handle(bot, conversations, messageListeners, postbackListeners, bodyWithMessage);
    webhooksHandler.handle(bot, conversations, messageListeners, postbackListeners, bodyWithPostback);

    expect(messagesHandler.handle.notCalled).to.be.ok;
    expect(postbacksHandler.handle.notCalled).to.be.ok;
  });
});
