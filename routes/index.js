var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express 5' });
});

router.get('/ip', function (req, res, next) {
  res.send(req.app.get('ip'));
});

module.exports = router;
