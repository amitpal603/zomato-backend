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

const router = Router()

//? user routes
router.post('/user/register' , UserRegister)
router.post('/user/login' , UserLogin)
router.post('/user/logout' ,authMiddleware, userLogout)

//! food partners routes

router.post('/food-partner/register' , foodPartnerRegister)
router.post('/food-partner/login' , foodPartnerLogin)
router.post('/food-partner/logout' , authMiddleware, foodPartnerLogout)


module.exports = router