const {Router} = require('express')
const { createFood } = require('../controllers/food.controller')
const foodPartnerAuthMiddleware = require('../middleware/fooPartner.middleware')
const upload = require('../middleware/multer.middleware').upload

const router = Router()

router.post('/upload/food' , foodPartnerAuthMiddleware , upload.single('video') , createFood)

module.exports = router