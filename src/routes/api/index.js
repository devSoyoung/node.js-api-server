const router = require('express').Router();

const authMiddleware = require('../../middlewares/auth');
const auth = require('./auth');
const user = require('./user');

router.use('/auth', auth);
// user 요청이 들어오면 authMiddleware 거친 후, user 라우터로 감
// 라우터 내부 모든 API 가 검증이 필요하므로 user/index.js가 아니라 여기에서 함
router.use('/user', authMiddleware);
router.use('/user', user);

module.exports = router;