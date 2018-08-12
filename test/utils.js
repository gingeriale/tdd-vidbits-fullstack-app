const {jsdom} = require('jsdom');

const parseTextFromHTML = (htmlAsString, selector) => {
  const selectedElement = jsdom(htmlAsString).querySelector(selector);
  if (selectedElement !== null) {
    return selectedElement.textContent;
  } else {
    throw new Error(`No element with selector ${selector} found in HTML string`);
  }
};

const generateRandomUrl = (domain) => {
  return `http://${domain}/${Math.random()}`;
};

const findIframeElementByUrl = (htmlAsString, url) => {
  const iframe = jsdom(htmlAsString).querySelector(`iframe[src="${url}"]`);
  if (iframe !== null) {
    return iframe;
  } else {
    throw new Error(`iframe with url "${url}" not found in HTML string`);
  }
};

module.exports = {
  parseTextFromHTML,
  generateRandomUrl,
  findIframeElementByUrl,
}
