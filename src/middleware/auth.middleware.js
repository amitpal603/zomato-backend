const jwt = require('jsonwebtoken');
const  User  = require('../models/user.model')


const authMiddleware = async (req, res, next) => {
    const token = req.cookies.accessToken || req.headers.authorization?.split(' ')[1]
    
    if (!token) {
        return res.status(401).json({ message: "Access token is missing" })
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN )
        const user = await User.findById({ _id : decoded._id }).select('-password -refreshToken')
        if (!user) {
            return res.status(401).json({ message: "User not found" })
        }
        req.userInfo = user
        
        next()
    } catch (error) {
        console.error(error)
        return res.status(401).json({ message: "Invalid or expired token" })
    }
}

module.exports = authMiddleware
 