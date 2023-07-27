var express = require('express');
var router = express.Router();
const authController = require('../controllers/authController');
const clubController = require('../controllers/clubController')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', user: req.user });
});

// User Authorization controls
router.get('/sign-up', authController.sign_up_get)
router.post('/sign-up', authController.sign_up_post)

router.get('/log-in', authController.log_in_get)
router.post('/log-in', authController.log_in_post);

router.get('/log-out', authController.log_out);

// Club controls
router.get('/join-club', clubController.join_club_get)
router.post('/join-club', clubController.join_club_post)



module.exports = router;
