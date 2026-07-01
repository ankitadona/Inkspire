const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    text:{
        type:String,
        required:true
    },

    reminder:{
        type:Date,
        default:null
    },

    completed:{
        type:Boolean,
        default:false
    }
},
{
    timestamps:true
});

const taskModel = mongoose.model("Task",taskSchema);

module.exports = taskModel;


