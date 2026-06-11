const User = require('../models/user.model')
const { generateAccessToken } = require('../utils/accessToken.util')
const FoodPartner = require('../models/foodPartner.model')

/**
 * @route POST /api/auth/user/register
 * @desc Register a new user
 * @access Public
 */
exports.UserRegister = async (req, res) => {
    const {fullName ,email , password} = req.body

    try {
        if(!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        if(fullName.length < 3 || password.length < 6) {
            return res.status(400).json({ message: "Full name must be at least 3 characters long and password must be at least 6 characters long" })
        }

        const existingUser = await User.findOne({ email })
        if(existingUser) {
            return res.status(400).json({ message: `${existingUser.email} with this email already exists` })
        }
        const newUser =  new User({ fullName, email, password })

        const payload = {
            _id : newUser._id,
            fullName : newUser.fullName,
            email : newUser.email
        }
        const {accessToken , refreshToken}= generateAccessToken(payload)
         newUser.refreshToken = refreshToken;
        await newUser.save()
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        }
        res.cookie('accessToken', accessToken, options)
        res.cookie('refreshToken', refreshToken, options)
        res.status(201).json({ message: "User registered successfully", 
            user: newUser,
            accessToken,
            refreshToken })
    } catch (error) {
        console.error("Error registering user:", error)
        res.status(500).json({ message: "Error registering user" })
    }
}

/**
 * @route POST /api/auth/user/login
 * @desc Login an existing user
 * @access Public
 */
exports.UserLogin = async (req, res) => {
    const { email , password } = req.body

    try {

        if(!email || !password) {
            return res.status(400).json({ message: "Email and password are required" })
        }

        if(password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" })
        }

        const user = await User.findOne({ email }).select('+password')

        if(!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const isMatch = await user.comparePassword(password)

        if(!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" })
        }
        const payload = {
            _id : user._id,
            email : user.email,
            fullName : user.fullName
        }
        const { accessToken, refreshToken } = generateAccessToken(payload)
        user.refreshToken = refreshToken
        await user.save()
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        }
        res.cookie('accessToken', accessToken, options)
        res.cookie('refreshToken', refreshToken, options)
        res.status(200).json({ message: `${user.fullName} logged in successfully`, 
            user,
            accessToken,
            refreshToken })
    } catch (error) {
        console.error("Error logging in user:", error)
        res.status(500).json({ message: "Error logging in user" })
    }
}

/**
 * 
 * @route POST /api/auth/user/logout
 * @desc Logout a user
 * @access Private
 */
exports.userLogout = async (req , res) => {
    try {
        const {_id , fullName} = req.userInfo

        res.clearCookie('accessToken')
        res.clearCookie('refreshToken')

     await User.findByIdAndUpdate(_id , { refreshToken : null })

        res.status(200).json({ message: `${fullName} logged out successfully` })
    } catch (error) {
        console.error("Error logging out user:", error)
        res.status(500).json({ message: "Error logging out user" })
    }
}

/**
 * @route POST /api/auth/food-partner/register
 * @desc Register a new food partner
 * @access Public 
 */
exports.foodPartnerRegister = async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        if (name.length < 3 || password.length < 6) {
            return res.status(400).json({ message: "Name must be at least 3 characters long and password must be at least 6 characters long" })
        }
    try {
        const isExistingFoodPartner = await FoodPartner.findOne({ email })

        if (isExistingFoodPartner) {
            return res.status(400).json({ message: `${isExistingFoodPartner.name} with this email already exists` })
        }
        const newFoodPartner = new FoodPartner({ name, email, password })

        const payload = {
            _id : newFoodPartner._id,
            email : newFoodPartner.email
        }
        const {accessToken , refreshToken}= generateAccessToken(payload)
         newFoodPartner.refreshToken = refreshToken;
        await newFoodPartner.save()
         const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        }
        res.cookie('accessToken', accessToken, options)
        res.cookie('refreshToken', refreshToken, options)
        res.status(201).json({ message: `${newFoodPartner.name} registered successfully`, 
            foodPartner: newFoodPartner,
            accessToken,
            refreshToken })
    } catch (error) {
        console.error("Error registering food partner:", error)
        res.status(500).json({ message: "Error registering food partner" })
    }
}

/**
 * @route POST /api/auth/food-partner/login
 * @desc Login an existing food partner
 * @access Public
 */
exports.foodPartnerLogin = async (req, res) => {
    const { email , password } = req.body

    try {

        if(!email || !password) {
            return res.status(400).json({ message: "Email and password are required" })
        }

        if(password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" })
        }

        const foodPartner = await FoodPartner.findOne({ email }).select('+password')

        if(!foodPartner) {
            return res.status(404).json({ message: "Food partner not found" })
        }

        const isMatch = await foodPartner.comparePassword(password)

        if(!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" })
        }
        const payload = {
            _id : foodPartner._id,
            email : foodPartner.email,
            name : foodPartner.name
        }
        const { accessToken, refreshToken } = generateAccessToken(payload)
        foodPartner.refreshToken = refreshToken
        await foodPartner.save()
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        }
        res.cookie('accessToken', accessToken, options)
        res.cookie('refreshToken', refreshToken, options)
        res.status(200).json({ message: `${foodPartner.name} logged in successfully`, 
            foodPartner,
            accessToken,
            refreshToken })
    } catch (error) {
        console.error("Error logging in food partner:", error)
        res.status(500).json({ message: "Error logging in food partner" })
    }
}

/**
 * @route POST /api/auth/food-partner/logout
 * @desc Logout a food partner
 * @access Private
 */
exports.foodPartnerLogout = async (req, res) => {
    try {
        const {_id , name} = req.foodPartnerInfo
       
        res.clearCookie('accessToken')
        res.clearCookie('refreshToken')

       const foodPartner = await FoodPartner.findByIdAndUpdate(_id , { refreshToken : null })

        res.status(200).json({ message: `${name} logged out successfully` })
    } catch (error) {
        console.error("Error logging out food partner:", error)
        res.status(500).json({ message: "Error logging out food partner" })
    }
}