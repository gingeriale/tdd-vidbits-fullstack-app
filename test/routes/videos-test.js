const {assert} = require('chai');
const {jsdom} = require('jsdom');
const request = require('supertest');
const app = require('../../app.js');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');
const Video = require('../../models/video.js');
const {parseTextFromHTML, generateRandomUrl, findIframeElementByUrl} = require('../utils.js');

describe('index', () => {

  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  describe('GET', () => {
    it('includes added video', async () => {
      const title = 'test title';
      const description = 'test description';
      const url = generateRandomUrl('example.com');
      const video = await Video.create({
        title,
        description,
        url,
      });
      const response = await request(app).get('/');
      assert.include(parseTextFromHTML(response.text, '#videos-container'), title);
      assert.include(parseTextFromHTML(response.text, '#videos-container'), description);
      const iframeElement = findIframeElementByUrl(response.text, url);
      assert.equal(iframeElement.src, url);
    });
  });

  describe('video with empty title', () => {
    it('isnt saved', async () => {
      const video = {
        title: undefined,
        description: 'test description',
        url: generateRandomUrl('example.com'),
      }
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(video);
      const createdVideos = await Video.find({});
      assert.strictEqual(createdVideos.length, 0);
    });

    it('responds with 400 status', async () => {
      const video = {
        title: undefined,
        description: 'test description',
        url: generateRandomUrl('example.com'),
      }
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(video);
      assert.strictEqual(response.status, 400);
    });

    it('renders form', async () => {
      const video = {
        title: undefined,
        description: 'test description',
        url: generateRandomUrl('example.com'),
      }
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(video);
      assert.include(parseTextFromHTML(response.text, 'body'), 'Path `title` is required.');
    });

    it('renders form with other fields filled', async () => {
      const video = {
        title: undefined,
        description: 'test description',
        url: generateRandomUrl('example.com'),
      }
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(video);
      assert.include(parseTextFromHTML(response.text, '#description'), video.description);
      assert.equal((jsdom(response.text)).querySelector(`input[value="${video.url}"]`).value, video.url);
    });
  });

  describe('video with empty url', () => {
    it('renders error message', async () => {
      const video = {
        title: 'test title',
        description: 'test description',
        url: undefined,
      }
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(video);
      assert.include(parseTextFromHTML(response.text, 'body'), 'Path `url` is required.');
    });
  });

  describe('GET id', () => {
    it('renders a video', async () => {
      const title = 'test title';
      const description = 'test description';
      const url = generateRandomUrl('example.com');
      const video = await Video.create({
        title,
        description,
        url,
      });
      const response = await request(app)
        .get(`/videos/${video._id}`);
      assert.include(parseTextFromHTML(response.text, 'body'), title);
      const iframeElement = findIframeElementByUrl(response.text, url);
      assert.equal(iframeElement.src, url);
    });
  });

  describe('GET edit', () => {
    it('renders a form for video', async () => {
      const title = 'test title';
      const description = 'test description';
      const url = generateRandomUrl('example.com');
      const video = await Video.create({
        title,
        description,
        url,
      });
      const response = await request(app)
        .get(`/videos/${video._id}/edit`);
      assert.equal((jsdom(response.text)).querySelector(`input[value="${video.title}"]`).value, video.title);
      assert.include(parseTextFromHTML(response.text, '#video-form'), description);
      assert.equal((jsdom(response.text)).querySelector(`input[value="${video.url}"]`).value, video.url);
    });
  });

  describe('POST edit', () => {
    it('updates the video', async () => {
      const title = 'test title';
      const description = 'test description';
      const url = generateRandomUrl('example.com');
      const video = await Video.create({
        title,
        description,
        url,
      });
      const titleToUpdate = 'test title to update';
      const descriptionToUpdate = 'test description to update';
      const urlToUpdate = generateRandomUrl('example.com');
      const videoToUpdate = {
        title: titleToUpdate,
        description: descriptionToUpdate,
        url: urlToUpdate,
      }
      const response = await request(app)
        .post(`/updates/${video._id}`)
        .type('form')
        .send(videoToUpdate);
      const updatedVideo = await Video.findOne(videoToUpdate);
      assert.equal(updatedVideo.title, videoToUpdate.title);
      assert.equal(updatedVideo.description, videoToUpdate.description);
      assert.equal(updatedVideo.url, videoToUpdate.url);
    });

    it('should redirect to show page', async () => {
      const title = 'test title';
      const description = 'test description';
      const url = generateRandomUrl('example.com');
      const video = await Video.create({
        title,
        description,
        url,
      });
      const titleToUpdate = 'test title to update';
      const descriptionToUpdate = 'test description to update';
      const urlToUpdate = generateRandomUrl('example.com');
      const videoToUpdate = {
        title: titleToUpdate,
        description: descriptionToUpdate,
        url: urlToUpdate,
      }
      const response = await request(app)
        .post(`/updates/${video._id}`)
        .type('form')
        .send(videoToUpdate);
      assert.equal(response.status, 302);
      assert.notInclude(response.headers.location, 'edit');
    });

    it('invalid video isnt saved, renders edit form and responds with 400', async () => {
      const title = 'test title';
      const description = 'test description';
      const url = generateRandomUrl('example.com');
      const video = {
        title,
        description,
        url,
      }
      await Video.create(video);
      const titleToUpdate = undefined;
      const descriptionToUpdate = 'test description to update';
      const urlToUpdate = generateRandomUrl('example.com');
      const videoToUpdate = {
        title: titleToUpdate,
        description: descriptionToUpdate,
        url: urlToUpdate,
      }
      const response = await request(app)
        .post(`/updates/${video._id}`)
        .type('form')
        .send(videoToUpdate);
      const createdVideo = await Video.findOne(video);
      assert.equal(createdVideo.title, title);
      assert.strictEqual(response.status, 400);
      assert.include(parseTextFromHTML(response.text, 'body'), 'Path `title` is required.');
    });
  });

  describe('POST delete', () => {
    it('deletes the video', async () => {
      const title = 'test title';
      const description = 'test description';
      const url = generateRandomUrl('example.com');
      const video = await Video.create({
        title,
        description,
        url,
      });
      const response = await request(app)
        .post(`/videos/${video._id}/deletions`)
        .type('form')
      const videoFromTheBase = await Video.findOne(video);
      assert.strictEqual(videoFromTheBase, null);
    });
  });

});
