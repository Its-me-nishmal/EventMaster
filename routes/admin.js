const express = require('express');
const router = express.Router();
const { verifyAdminLogin } = require('../middleware/verify-middleware')
const {
  getLoginPage, postLogin, getLogOut, getAccount,
  getHomePage } = require('../controllers/admin/admin-controller')

/* Login - LogOut */
router.get('/login', getLoginPage);
router.post('/login', postLogin);
router.get('/logout', getLogOut);

router.get('/', verifyAdminLogin, getHomePage);

// Account
router.get('/account', verifyAdminLogin, getAccount);


module.exports = router;