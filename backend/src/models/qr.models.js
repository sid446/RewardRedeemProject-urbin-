import mongoose,{Schema} from "mongoose";

const QrSchema = new Schema({
uuid:{
    type:String,
    required:true,
    unique:true
},
url:{
    type:String,
    required:true
},
used:{
    type:Boolean,
    default:false
}

},{timestamps:true});

export const QRcode =mongoose.model("QRcode",QrSchema)
