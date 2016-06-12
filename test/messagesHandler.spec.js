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
      messagesHandler.handle(bot, listeners, userId, 'bye');
      expect(listener.notCalled).to.be.ok;
    });

    it('should send back an error', () => {
      messagesHandler.handle(bot, listeners, userId, 'bye');
      expect(bot.send.calledWithMatch(userId, /Cannot handle message/)).to.be.ok;
    });

    it('should call the listener', () => {
      messagesHandler.handle(bot, listeners, userId, 'hello');
      expect(listener.calledOnce).to.be.ok;
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
      messagesHandler.handle(bot, listeners, userId, 'Your name is Joe');
      expect(listener.notCalled).to.be.ok;
    });

    it('should send back an error', () => {
      messagesHandler.handle(bot, listeners, userId, 'Your name is Joe');
      expect(bot.send.calledWithMatch(userId, /Cannot handle message/)).to.be.ok;
    });

    it('should call the listener', () => {
      messagesHandler.handle(bot, listeners, userId, 'my name is Joe');
      expect(listener.calledOnce).to.be.ok;
    });

    it('should pass matches to listener', () => {
      messagesHandler.handle(bot, listeners, userId, 'my name is Joe');
      expect(listener.args[0][2].matches[1]).to.equal('Joe');
    });
  });
});
