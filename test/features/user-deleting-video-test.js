const {assert} = require('chai');
const {generateRandomUrl} = require('../utils');
const {setValuesAndSubmit} = require('./feature-utils');

describe('user visits video show page', () => {
  describe('deletes video', () => {
    it('and it doesnt appear at list', () => {
      const title = 'test title';
      const url = generateRandomUrl('example.com');
      setValuesAndSubmit(title, url);
      browser.click('#submit-button');
      assert.notInclude(browser.getText('body'), title);
    });
  });
});
