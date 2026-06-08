const {Router} = require('express')
const { UserRegister, UserLogin } = require('../controllers/auth.controller')

const router = Router()


router.post('/user/register' , UserRegister)
router.post('/user/login' , UserLogin)

module.exports = router