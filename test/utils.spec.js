'use strict';

const expect = require('chai').expect;

const utils = require('../lib/utils');

describe('utils', () => {

  it('should return a text message', () => {
    const text = 'my message';
    const message = utils.buildTextMessage(text);

    expect(message.text).to.equal(text);
  });

  it('should return a button template message', () => {
    const text = 'my message';
    const buttons = [];

    const message = utils.buildButtonTemplateMessage(text, buttons);

    expect(message.attachment.payload.template_type).to.equal('button');
    expect(message.attachment.payload.text).to.equal(text);
    expect(message.attachment.payload.buttons).to.equal(buttons);
  });

  it('should return a generic template message', () => {
    const elements = [];
    const message = utils.buildGenericTemplateMessage(elements);

    expect(message.attachment.payload.template_type).to.equal('generic');
    expect(message.attachment.payload.elements).to.equal(elements);
  });

  it('should return a generic template element', () => {
    const title = 'title';
    const subtitle = 'subtitle';
    const imageUrl = 'imageUrl.png';
    const itemUrl = 'http://itemUrl.com';
    const buttons = [];

    const message = utils.buildGenericTemplateElement(title, subtitle, imageUrl, itemUrl, buttons);

    expect(message.title).to.equal(title);
    expect(message.subtitle).to.equal(subtitle);
    expect(message.image_url).to.equal(imageUrl);
    expect(message.item_url).to.equal(itemUrl);
    expect(message.buttons).to.equal(buttons);
  });

  it('should return a postback button', () => {
    const title = 'main button';
    const payload = {type: 'mainButton', data: {}};

    const button = utils.buildPostbackButton(title, payload);

    expect(button.title).to.equal(title);
    expect(button.payload).to.equal(JSON.stringify(payload));
  });

  it('should return a web_url button', () => {
    const title = 'main button';
    const url = 'http://url.com';

    const button = utils.buildWebUrlButton(title, url);

    expect(button.title).to.equal(title);
    expect(button.url).to.equal(url);
  });
});
