'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');

const conversationFactory = require('../lib/conversationFactory');
const conversationsHandler = require('../lib/conversationsHandler');

describe('conversationsHandler', () => {
  let bot;
  let conversation;

  const userId = 'userId';
  const message = {text: 'Hey'};

  beforeEach(() => {
    bot = {send: sinon.spy()};
    conversation = conversationFactory.create(bot, userId);
  });

  it('should pass message to conversation', () => {
    sinon.spy(conversation, '_onEvent');
    conversationsHandler.handle(bot, conversation, userId, message);
    expect(conversation._onEvent.calledWith(message)).to.be.ok;
  });
});
