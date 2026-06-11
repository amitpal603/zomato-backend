const {Router} = require('express')
const { 
    UserRegister, 
    UserLogin, 
    userLogout, 
    foodPartnerRegister, 
    foodPartnerLogin, 
    foodPartnerLogout
 } = require('../controllers/auth.controller')
const authMiddleware = require('../middleware/auth.middleware')
const foodPartnerAuthMiddleware = require('../middleware/fooPartner.middleware')

const router = Router()

//? user routes
router.post('/user/register' , UserRegister)
router.post('/user/login' , UserLogin)
router.post('/user/logout' ,authMiddleware, userLogout)

//! food partners routes

router.post('/food-partner/register' , foodPartnerRegister)
router.post('/food-partner/login' , foodPartnerLogin)
router.post('/food-partner/logout' , foodPartnerAuthMiddleware, foodPartnerLogout)


module.exports = router