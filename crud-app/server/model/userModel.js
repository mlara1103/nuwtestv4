import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    nboletas:{
        type: String,
        required: true
    },
    vcefectivo:{
        type: Number,
        required: true
    },
    vsefectivo:{
        type: Number,
        required: true
    },
     
})


export default mongoose.model("User", userSchema);