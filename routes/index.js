var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', user: req.user });
});

router.get('/sign-up', userController.sign_up_get)
router.post('/sign-up', userController.sign_up_post)

router.get('/log-in', userController.log_in_get)
router.post('/log-in', userController.log_in_post);

router.get('/log-out', userController.log_out)



module.exports = router;
