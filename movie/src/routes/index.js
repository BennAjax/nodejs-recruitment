const express = require('express');
const controller = require('../controllers/movieController');
const validate = require('../lib/middleware/joiValidation');
const schema = require('../lib/middleware/movieSchema');
const jwt = require('../lib/jwt');

const router = express.Router();

const health = (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.send({ status: 'OK' });
};

router.get('/health', health);
router.get('/movies', jwt.verifyToken, controller.getMovieByUser);
router.post('/movies', jwt.verifyToken, validate(schema), controller.createMovie);

module.exports = router;
