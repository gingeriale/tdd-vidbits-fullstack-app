const {assert} = require('chai');
const {generateRandomUrl} = require('../utils');

describe('user visits landing', () => {
  describe('navigates to create page', () => {
    it('sees he can create videos', () => {
      browser.url('/');
      browser.click('#create-link');
      assert(browser.getText('body'), 'Save a video');
    });

    it('can submit the form', () => {
      const title = 'test video title';
      const description = 'test video description';
      browser.url('/videos/create');
      browser.setValue('#title', title);
      browser.setValue('#description', description);
      browser.setValue('#url', generateRandomUrl('example.com'));
      browser.click('#submit-button');
      assert.include(browser.getText('body'), title);
      assert.include(browser.getText('body'), description);
    });
  });
});
