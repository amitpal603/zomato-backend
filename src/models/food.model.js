const {Schema , model} = require('mongoose')

const foodSchema = new Schema({
    name : {
        type : String,
        required : [true , "Food name is required"],
        trim : true
    },
    description : {
        type : String,
        required : [true , "Food description is required"],
        trim : true
    },
    videoUrl : {
        type : String,
        default : null
        
    },
    videoPublicId : {
        type : String,
        default : null
    },
    vendor : {
        type : Schema.Types.ObjectId,
        ref : "FoodPartner",
        required : [true , "Food vendor is required"]
    },
    price : {
        type : Number,
        required : [true , "Food price is required"],
        min : [0 , "Food price cannot be negative"]
    },
} , {timestamps : true})

const Food = model("Food", foodSchema)

module.exports = Food