const {assert} = require('chai');
const request = require('supertest');
const app = require('../../app.js');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');
const Video = require('../../models/video.js');
const {generateRandomUrl} = require('../utils');

describe('creation', () => {

  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  describe('POST to /videos', () => {
    it('should redirect to show page', async () => {
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send({
          title: 'test title',
          description: 'test description',
          url: generateRandomUrl('example.com'),
        });
      assert.equal(response.status, 302);
      assert.include(response.headers.location, '/videos/');
    });

    it('saves a video document', async () => {
      const title = 'test title';
      const description = 'test description';
      const url = generateRandomUrl('example.com');
      const video = {
        title,
        description,
        url,
      }
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(video);
      const createdVideo = await Video.findOne(video);
      assert.equal(createdVideo.url, video.url);
    });
  });

  describe('saves video', () => {
    it('to the database', async () => {
      const video = {
        title: 'test title',
        description: 'test description',
        url: generateRandomUrl('example.com'),
      }
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(video);
      const createdVideo = await Video.findOne(video);
      assert.equal(createdVideo.title, video.title);
      assert.equal(createdVideo.description, video.description);
    });
  });

});
