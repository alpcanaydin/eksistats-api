const express = require('express');
const homeCtrl = require('./controller/home');
const generalCtrl = require('./controller/general');
const userCtrl = require('./controller/user');
const topicCtrl = require('./controller/topic');

const router = express.Router();

router.get('/', homeCtrl);
router.get('/general', generalCtrl);
router.get('/user/:user', userCtrl);
router.get('/topic/:topic', topicCtrl);

module.exports = router;
