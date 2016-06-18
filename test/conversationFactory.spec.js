'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');

const conversationFactory = require('../lib/conversationFactory');

describe('conversationFactory', () => {
  let bot;
  let userId = 'userId';

  let conversation;

  beforeEach(() => {
    bot = {send: sinon.spy()};
    conversation = conversationFactory.create(bot, userId);
  });

  it('should create conversation', () => {
    expect(conversation).to.be.an('object');
  });

  it('should be active', () => {
    expect(conversation.isActive()).to.be.true;
  });

  it('should end conversation', () => {
    conversation.end();
    expect(conversation.isActive()).to.be.false;
  });

  it('should ask question', () => {
    const question = 'Do you like pizza?';
    conversation.ask(question, sinon.spy());
    expect(bot.send.calledWith(userId, question)).to.be.ok;
  });

  it('should handle answer', () => {
    const question = 'Do you like pizza?';
    const callback = sinon.spy();
    const message = {text: 'Yeah!'};

    conversation.ask(question, callback);
    conversation._onEvent(message);

    expect(callback.calledWith(conversation, message)).to.be.ok;
  });

  it('should ask questions one by one', () => {
    const question1 = 'Question 1';
    const callback1 = sinon.spy();
    const question2 = 'Question 2';
    const callback2 = sinon.spy();

    conversation.ask(question1, callback1);
    conversation.ask(question2, callback2);

    expect(bot.send.callCount).to.equal(1);
    conversation.next();
    expect(bot.send.callCount).to.equal(2);
  });

  it('should call the onEnd callback when no more messages left', () => {
    const onEndCallback = sinon.spy();

    const question = 'Do you like pizza?';
    const callback = sinon.spy();

    conversation.ask(question, callback);
    conversation.onEnd(onEndCallback);
    conversation.next();

    expect(onEndCallback.calledWith(conversation)).to.be.ok;
  });

  it('should have context in conversation', () => {
    expect(conversation.context).to.be.exist;
  });

  it('should send message to user', () => {
    conversation.send('Hey!');
    expect(bot.send.calledWith(userId, 'Hey!'));
  });
});
