const Router = require('koa-router');
const gridStateControllers = require('../controllers/gridState');

const {
    getGridState,
    updateIfCurrentGridState,
    initializeGridState,
} = gridStateControllers;

const router = new Router({ prefix: '/gridState' });

router.get('/get-gridstate/:id', getGridState);
router.post('/update-if-current-gridstate/:id', updateIfCurrentGridState);
router.post('/initialize-gridstate', initializeGridState);

module.exports = router;
