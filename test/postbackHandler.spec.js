'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');

const postbacksHandler = require('../lib/postbacksHandler');

describe('postbacksHandler', () => {
  let bot;
  let listeners;
  const userId = 'userId';
  const payload = {type: 'info', data: {itemId: '1'}};

  beforeEach(() => {
    bot = {send: sinon.spy()};
    listeners = new Map();
  });

  it('should not call the listener', () => {
    const listener = sinon.spy();
    listeners.set('details', listener);

    postbacksHandler.handle(bot, listeners, userId, payload);

    expect(listener.notCalled).to.be.ok;
  });

  it('should send back an error', () => {
    const listener = sinon.spy();
    listeners.set('details', listener);

    postbacksHandler.handle(bot, listeners, userId, payload);

    expect(bot.send.calledWithMatch(userId, /Cannot handle postback/)).to.be.ok;
  });

  it('should call the listener', () => {
    const listener = sinon.spy();
    listeners.set('info', listener);

    postbacksHandler.handle(bot, listeners, userId, payload);

    expect(listener.calledWith(bot, userId, payload.data)).to.be.ok;
  });
});
