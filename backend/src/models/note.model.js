const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        deflault:""
    },
    category:{
        type:String,
        enum:["Study","Personal","Work","Ideas"],
        default:"Study"
    },
     color:{
        type:String,
        default:"#fffaf4"
    },
    favorite:{
        type:Boolean,
        default:false
    },
    pinned:{
        type:Boolean,
        default:false
    }
},
{
    timestamps:true
});

const noteModel = mongoose.model("Note",noteSchema);

module.exports = noteModel;