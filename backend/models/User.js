const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    phone_number: { type: String, required: false },
    googleId: { type: String, unique: true, sparse: false },
    profile_picture_url: { type: String },
    email: { type: String, required: true, unique: true },
    dob: { type: Date, required: false },  
    age: { type: Number, required: false },
    gender: { type: String,required: false },
    home_location: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    password: { type: String, required: false }

  }, 
  { timestamps: true }
);
// Hash password before saving
// UserSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) return next();
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   });

module.exports = mongoose.model("User", UserSchema);
