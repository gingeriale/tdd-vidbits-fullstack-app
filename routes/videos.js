const router = require('express').Router();
const Video = require('../models/video.js');

router.post('/videos', async (req, res) => {
  const {title, description, url} = req.body;
  const video = new Video({
    title,
    description,
    url,
  });
  video.validateSync();
  if (video.errors) {
    if (video.errors.title) {
      res.status(400).render('videos/create', {
        error: video.errors.title.message,
        video,
      });
    }
    if (video.errors.url) {
      res.status(400).render('videos/create', {
        error: video.errors.url.message,
        video,
      });
    }
  }
  else {
    await video.save();
    res.redirect(`/videos/${video._id}`);
  }
});

router.get('/', async (req, res) => {
  const videos = await Video.find({});
  res.render('index', {videos});
});

router.get('/videos/create', async (req, res) => {
  res.render('videos/create');
});

router.get('/videos/:id', async (req, res) => {
  const id = req.params.id
  const video = await Video.findById(id);
  res.render('videos/show', {video});
});

router.get('/videos/:id/edit', async (req, res) => {
  const id = req.params.id
  const video = await Video.findById(id);
  res.render('videos/edit', {video});
});

router.post('/updates/:id', async (req, res) => {
  const {title, description, url} = req.body;
  const video = new Video({
    title,
    description,
    url,
  });
  video.validateSync();
  if (video.errors) {
    if (video.errors.title) {
      res.status(400).render('videos/edit', {
        error: video.errors.title.message,
        video,
      });
    }
    if (video.errors.url) {
      res.status(400).render('videos/edit', {
        error: video.errors.url.message,
        video,
      });
    }
  }
  else {
    const id = req.params.id;
    const videoToEdit = await Video.findById(id);
    videoToEdit.title = title;
    videoToEdit.description = description;
    videoToEdit.url = url;
    await videoToEdit.save();
    res.redirect(`/videos/${videoToEdit._id}`);
  }
});

router.post('/videos/:id/deletions', async (req, res) => {
  const id = req.params.id;
  const video = await Video.findById(id);
  await video.remove();
  res.redirect('/');
});

module.exports = router;
