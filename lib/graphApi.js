'use strict';

const request = require('request');

const _send = (path, body, config, cb) => {
  const graphApiUrl = config.graphApiUrl || 'https://graph.facebook.com/v2.6/';

  request({
    method: 'POST',
    url: `${graphApiUrl}${path}`,
    qs: {access_token: config.accessToken},
    json: body
  }, (error, response) => {
    if (error) {
      console.log(`Error: ${error}`);
    } else if (response.body.error) {
      console.log(`Error in response: ${JSON.stringify(response.body.error)}`);
    }

    cb && cb(error, response);
  });
};

const isValidToken = (userToken, configToken) => {
  return userToken === configToken;
};

const sendMessage = (config, recipient, message) => {
  _send('me/messages', {recipient, message}, config, (error, response) => {
    if (response.body) {
      console.log(`sendMessage response: ${JSON.stringify(response.body)}`)
    }
  });
};

const threadSettings = (config, body) => {
  _send(`${config.pageId}/thread_settings`, body, config, (error, response) => {
    if (response.body) {
      console.log(`threadSettings response: ${JSON.stringify(response.body)}`)
    }
  });
};

module.exports = {
  isValidToken,
  sendMessage,
  threadSettings
};
