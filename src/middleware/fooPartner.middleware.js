const jwt = require('jsonwebtoken');
const FoodPartner = require('../models/foodPartner.model')

const foodPartnerAuthMiddleware = async (req, res, next) => {
    const token = req.cookies.accessToken || req.headers.authorization?.split(' ')[1]
        
        if (!token) {
            return res.status(401).json({ message: "Access token is missing" })
        }
    
        try {
            const decoded = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN )
            const foodPartner = await FoodPartner.findById({_id : decoded._id}).select('-password -refreshToken')
           req.foodPartnerInfo = foodPartner
            next()
        } catch (error) {
            console.error(error)
            return res.status(401).json({ message: "Invalid or expired token" })
        }
}

module.exports = foodPartnerAuthMiddleware