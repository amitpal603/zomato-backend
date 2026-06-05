const {Schema , model} = require('mongoose')
const jwt = require('jsonwebtoken')
const argon2 = require('argon2')

const userSchema = new Schema({
    fullName: {
        type: String,
        required: [true , "Full name is required"],
        minlength: [3, "Full name must be at least 3 characters long"]
    },
    email : {
        type: String,
        required: [true , "Email is required"],
        unique: true,
        match: [/\S+@\S+\.\S+/, "Please use a valid email address"]
    },
    password : {
        type: String,
        required: [true , "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"]
    },
    refreshToken: {
        type: String,
        default: null
    }
} , {timestamps: true})

userSchema.pre('save', async function() {
  if(!this.isModified('password')) return
    try {
        this.password = await argon2.hash(this.password)
    } catch (error) {
        console.error("Error hashing password:", error)
    }
})

userSchema.methods.comparePassword = async function(userPassword) {
    try {
        return await argon2.verify(this.password, userPassword)
    } catch (error) {
        console.error("Error comparing passwords:", error)
        throw error
    }
}

const User = model('User' , userSchema)

module.exports = User