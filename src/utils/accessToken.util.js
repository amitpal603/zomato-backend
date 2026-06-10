const jwt = require('jsonwebtoken')


exports.generateAccessToken = (payload) => {
    const accessToken = jwt.sign(payload ,process.env.ACCESS_SECRET_TOKEN , {expiresIn: '15m'})
    const refreshToken = jwt.sign({_id : payload._id , email : payload.email} , process.env.REFRESH_SECRET_TOKEN , {expiresIn: '7d'})
    return { accessToken, refreshToken }
}

