'use strict';

const expect = require('chai').expect;

const graphApi = require('../lib/graphApi');

describe('graphApi', () => {

  it('should validate verify token', () => {
    expect(graphApi.isValidToken('123', '456')).to.be.false;
    expect(graphApi.isValidToken('123', '123')).to.be.true;
  });
});
