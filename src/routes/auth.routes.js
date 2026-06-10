const {Router} = require('express')
const { UserRegister, UserLogin, userLogout } = require('../controllers/auth.controller')
const authMiddleware = require('../middleware/auth.middleware')

const router = Router()


router.post('/user/register' , UserRegister)
router.post('/user/login' , UserLogin)
router.post('/user/logout' ,authMiddleware, userLogout)


module.exports = router