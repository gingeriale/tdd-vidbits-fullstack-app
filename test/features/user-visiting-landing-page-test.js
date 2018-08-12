const {assert} = require('chai');
const {generateRandomUrl} = require('../utils');
const {setValuesAndSubmit} = require('./feature-utils');

describe('user visits landing', () => {

  describe('with no existing videos', () => {
    it('and videos-container should be empty', () => {
      browser.url('/');
      assert.equal(browser.getText('#videos-container'), '');
    });
  });

  describe('with existing video', () => {
    it('it title is rendered', () => {
      const title = 'test title';
      const url = generateRandomUrl('example.com');
      setValuesAndSubmit(title, url);
      browser.url('/');
      assert.include(browser.getText('#videos-container'), title);
    });

    it('renders it in a list', () => {
      const title = 'test title';
      const url = generateRandomUrl('example.com');
      setValuesAndSubmit(title, url);
      browser.url('/');
      assert.include(browser.getAttribute('body iframe', 'src'), url);
    });

    it('can navigate to a single video page', () => {
      const title = 'test title';
      const url = generateRandomUrl('example.com');
      setValuesAndSubmit(title, url);
      browser.url('/');
      browser.click('.video-title a');
      assert.include(browser.getText('body'), 'Show video');
    });
  });

});
