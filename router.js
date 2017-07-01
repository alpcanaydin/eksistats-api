const express = require('express');
const homeCtrl = require('./controller/home');
const generalCtrl = require('./controller/general');
const authorCtrl = require('./controller/author');
const topicCtrl = require('./controller/topic');

const router = express.Router();

router.get('/', homeCtrl);
router.get('/general', generalCtrl);
router.get('/author', authorCtrl);
router.get('/topic', topicCtrl);

module.exports = router;
