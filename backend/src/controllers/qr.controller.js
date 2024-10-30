import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { QRcode } from "../models/qr.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";





const generateQr=asyncHandler(async(req,res)=>{

    const uuid=uuidv4();

    const url=`http://localhost:5000/access?uuid=${uuid}`;
    
    const qrDataUrl = await QRCode.toDataURL(url);
    const qrCodeEntry=new QRcode({uuid,url});
    await qrCodeEntry.save();

    return res.status(201).json(new ApiResponse(200,qrDataUrl,"Qr code created successfully"))

})
const checkQr = asyncHandler(async (req, res) => {
    const {uuid} = req.query; // Correctly extract 'uuid' from the query
    if (!uuid) {
        throw new ApiError(400, "UUID is not received");
    }

    const qrCodeEntry = await QRcode.findOne({ uuid });
    
    if (!qrCodeEntry) {
        throw new ApiError(400, "Not accessible through this QR code");
    }
    
    return res.status(200).json(new ApiResponse(200, qrCodeEntry.used, "QR code checked successfully"));
});

const Used=asyncHandler(async(req,res)=>{
    const {uuid}=req.body;
    if(!uuid){
        throw new ApiError(400,"uuid is not received")
    }
    const qrCodeEntry=await QRcode.findOne({uuid})

    if(!qrCodeEntry){
        throw new ApiError(400,"not accesable through this qr")
    }
    qrCodeEntry.used = true;
    await qrCodeEntry.save();

    return res.status(201).json(new ApiResponse(200,"Qr code used now "))



})

export {generateQr,Used,checkQr}