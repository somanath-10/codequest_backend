const mongoose=require('mongoose');
const mailSender = require('../utils/mailSender');
const emailTemplate = require("../mail/templates/emailVerificationTemplate");


const OTPSchema=new mongoose.Schema({

    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires: 5*60,
    },

});

async function sendVerificationEmail(email,otp) {
    try{
        const mailResponse = await mailSender(email,"verification of email from study notion",emailTemplate(otp));
        console.log("mail sent successfully",mailResponse)
    }
    catch(err){
        console.log("error in otp mail sender otp.js")
    }
    
}
OTPSchema.pre("save",async function(next) {
    
    if (this.isNew) {
		await sendVerificationEmail(this.email, this.otp);
	}
    next();
})
module.exports=mongoose.model("OTP",OTPSchema);