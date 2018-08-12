const {assert} = require('chai');
const {generateRandomUrl} = require('../utils');
const {setValuesAndSubmit} = require('./feature-utils');

describe('user visits video show page', () => {
  describe('navigates to edit video', () => {
    it('can edit video field', () => {
      const title = 'test title';
      const url = generateRandomUrl('example.com');
      setValuesAndSubmit(title, url);
      browser.click('#edit');
      const editedTitle = 'test edited title';
      browser.setValue('#title', editedTitle);
      browser.click('#submit-button');
      assert.include(browser.getText('.video-title'), editedTitle);
    });

    it('rewrites old video', () => {
      const title = 'test title';
      const url = generateRandomUrl('example.com');
      setValuesAndSubmit(title, url);
      browser.click('#edit');
      const editedTitle = 'test edited title';
      browser.setValue('#title', editedTitle);
      browser.click('#submit-button');
      browser.url('/');
      assert.notInclude(browser.getText('body'), title);
    });
  });
});
