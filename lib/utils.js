const buildTextMessage = (text) => {
  return {text};
};

const buildButtonTemplateMessage = (text, buttons) => {
  return {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'button',
        text: text,
        buttons: buttons
      }
    }
  };
};

const buildGenericTemplateMessage = (elements) => {
  return {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: elements.length <= 10 ? elements : elements.slice(0, 10)
      }
    }
  };
};

const buildGenericTemplateElement = (title, subtitle, imageUrl, itemUrl, buttons) => {
  return {
    title: title,
    subtitle: subtitle,
    image_url: imageUrl,
    item_url: itemUrl,
    buttons: buttons
  };
};

const buildPostbackButton = (title, payload) => {
  return {
    type: 'postback',
    title: title,
    payload: JSON.stringify(payload)
  };
};

const buildWebUrlButton = (title, url) => {
  return {
    type: 'web_url',
    title: title,
    url: url
  };
};

module.exports = {
  buildTextMessage,
  buildButtonTemplateMessage,
  buildGenericTemplateMessage,
  buildGenericTemplateElement,
  buildPostbackButton,
  buildWebUrlButton
};
