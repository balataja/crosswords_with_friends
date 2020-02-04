const Router = require('koa-router');
const crosswordControllers = require('../controllers/crossword');

const {
  getCrossword,
  getCrosswords,
} = crosswordControllers;

const router = new Router({ prefix: '/crossword' });

router.get('/get-crossword/:id', getCrossword);
router.get('/get-crosswords', getCrosswords);

module.exports = router;
