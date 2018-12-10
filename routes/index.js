var express = require('express');
var router = express.Router();
var snakeHandler = require('../snakeHandler.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Battlesnake' });
});

router.get('/viewer', function(req, res, next) {
  res.render('viewer', { title: 'Battlesnake' });
});

router.get('/dev', function(req, res, next) {
  res.render('dev', { title: 'Battlesnake' });
});

router.get('/admin', function(req, res, next) {
  res.render('admin', { title: 'Battlesnake' });
});

router.post('/queue', function(req, res, next) {
  result = snakeHandler.addSnake(req.query.name, req.query.url)
  if(result instanceof Error){
    res.status(400).send({error: result.message});
  } else {
    res.status(200).send();
  }
});

router.post('/config', function(req, res, next) {
  result = snakeHandler.setConfig(req.query.autostart)
  if(result instanceof Error){
    res.status(400).send({error: result.message});
  } else {
    res.status(200).send();
  }
});

router.post('/start', function(req, res, next) {
  result = snakeHandler.startCountdown();
  if(result instanceof Error){
    res.status(400).send({error: result.message});
  } else {
    res.status(200).send();
  }
});

router.delete('/queue', function(req, res, next) {
  result = snakeHandler.removeSnake(req.query.url);
  if(result instanceof Error){
    res.status(400).send({error: result.message});
  } else {
    res.status(200).send();
  }
});

module.exports = router;
