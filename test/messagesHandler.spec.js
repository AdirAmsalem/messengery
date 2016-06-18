'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');

const messagesHandler = require('../lib/messagesHandler');

describe('messagesHandler', () => {
  let bot;
  let listeners;
  const userId = 'userId';

  beforeEach(() => {
    bot = {send: sinon.spy()};
    listeners = new Map();
  });

  describe('string matchers', () => {
    const matcher = 'hello';
    let listener;

    beforeEach(() => {
      listener = sinon.spy();
      listeners.set(matcher, listener);
    });

    it('should not call the listener', () => {
      messagesHandler.handle(bot, listeners, userId, {text: 'bye'});
      expect(listener.notCalled).to.be.ok;
    });

    it('should send back an error', () => {
      messagesHandler.handle(bot, listeners, userId, {text: 'bye'});
      expect(bot.send.calledWithMatch(userId, /Cannot handle message/)).to.be.ok;
    });

    it('should call the listener', () => {
      const text = 'hello';
      messagesHandler.handle(bot, listeners, userId, {text});
      expect(listener.calledWith(bot, userId, {text})).to.be.ok;
    });
  });

  describe('RegExp matchers', () => {
    const matcher = /my name is (.+)/;
    let listener;

    beforeEach(() => {
      listener = sinon.spy();
      listeners.set(matcher, listener);
    });

    it('should not call the listener', () => {
      messagesHandler.handle(bot, listeners, userId, {text: 'Your name is Joe'});
      expect(listener.notCalled).to.be.ok;
    });

    it('should send back an error', () => {
      messagesHandler.handle(bot, listeners, userId, {text: 'Your name is Joe'});
      expect(bot.send.calledWithMatch(userId, /Cannot handle message/)).to.be.ok;
    });

    it('should call the listeners with text and matches', () => {
      const message = {text: 'my name is Joe'};
      const matches = matcher.exec(message.text);

      messagesHandler.handle(bot, listeners, userId, message);

      expect(listener.calledWith(bot, userId, {text: message.text, matches})).to.be.ok;
    });
  });
});
