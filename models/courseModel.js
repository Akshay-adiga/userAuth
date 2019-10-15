const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    // _id:{type:mongoose.Schema.Types.ObjectId,unique: true},
    name:{type:String,required: true},
    hours:Number,
    handledBy:String,
    category:String,
    rating:Number
});

module.exports = mongoose.model('Course',courseSchema);