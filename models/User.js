const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    // _id:{type:mongoose.Schema.Types.ObjectId,unique: true},
    name:{type:String,required: true},
    email:{type:String,required: true,unique: true},
    password:{type:String,required: true},
    created_at: {type:Date, default: Date.now}
});

module.exports = mongoose.model('User',userSchema);