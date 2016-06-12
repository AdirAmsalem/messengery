'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');

const graphApi = require('../lib/graphApi');
const messengerApi = require('../lib/messengerApi');

describe('messengerApi', () => {
  const config = {};
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(graphApi, 'sendMessage');
    sandbox.stub(graphApi, 'threadSettings');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should set text welcome screen message', () => {
    const message = 'welcome!';
    messengerApi.setWelcomeScreenMessage(config, message);

    expect(graphApi.threadSettings.calledOnce).to.be.ok;
    expect(graphApi.threadSettings.args[0][1].call_to_actions[0].message).to.deep.equal({text: message})
  });

  it('should set structured welcome screen message', () => {
    const message = {};
    messengerApi.setWelcomeScreenMessage(config, message);

    expect(graphApi.threadSettings.args[0][1].call_to_actions[0].message).to.deep.equal(message)
  });

  it('should send text message', () => {
    const message = 'text message';
    const userId = '123';
    messengerApi.sendMessage(config, userId, message);

    expect(graphApi.sendMessage.calledWith(config, {id: userId}, {text: message})).to.be.ok;
  });

  it('should send structured message', () => {
    const message = {};
    const userId = '123';
    messengerApi.sendMessage(config, userId, message);

    expect(graphApi.sendMessage.calledWith(config, {id: userId}, message)).to.be.ok;
  });
});
