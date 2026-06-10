const {Schema , model} = require('mongoose')
const argon2 = require("argon2");
const foodPartnerSchema = new Schema({
    name : {
        type : String,
        required : [true , "Food partner name is required"],
        minLength : [3 , "Food partner name must be at least 3 characters long"],
        trim : true
    },
    email : {
        type : String,
        required : [true , "Food partner email is required"],
        unique : [true , "Food partner with this email already exists"],
        trim : true,
        lowercase : true
    },
    password : {
        type : String,
        required : [true , "Food partner password is required"],
        minLength : [6 , "Food partner password must be at least 6 characters long"],
        select : false
    },
    refreshToken : {
        type : String,
        default : null,
        select : false
    }
} , {timestamps : true , toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.refreshToken;
        delete ret.__v;
        return ret;
      },
    },})

    // Hash password before save
    foodPartnerSchema.pre("save", async function () {
      try {
        if (!this.isModified("password")) {
          return 
        }
    
        this.password = await argon2.hash(this.password);
        next();
      } catch (error) {
        console.log(error)
      }
    });
    
    // Compare password
    foodPartnerSchema.methods.comparePassword = async function (candidatePassword) {
      return await argon2.verify(this.password, candidatePassword);
    };
    
    const FoodPartner = model("FoodPartner", foodPartnerSchema);
    
    module.exports = FoodPartner;