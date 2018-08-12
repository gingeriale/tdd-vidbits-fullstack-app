const {assert} = require('chai');
const Video = require('../../models/video.js');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');

describe('model: video', () => {

  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  describe('has a title', () => {
    it('of string type', () => {
      const titleAsNonString = 1;
      const video = new Video({title: titleAsNonString});
      assert.strictEqual(video.title, titleAsNonString.toString());
    });

    it('is required', () => {
      const video = new Video({});
      video.validateSync();
      assert.equal(video.errors.title.message, 'Path `title` is required.');
    });
  });

  describe('has a description', () => {
    it('of string type', () => {
      const descriptionAsNonString = 1;
      const video = new Video({description: descriptionAsNonString});
      assert.strictEqual(video.description, descriptionAsNonString.toString());
    });
  });

  describe('has a url', () => {
    it('of string type', () => {
      const urlAsNonString = 1;
      const video = new Video({url: urlAsNonString});
      assert.strictEqual(video.url, urlAsNonString.toString());
    });
  });

});
