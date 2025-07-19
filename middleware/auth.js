import jwt from "jsonwebtoken"

const auth=(req,res,next)=>{
    try {
        const token=req.headers.authorization.split(" ")[1] || req?.cookies?.token || req?.body?.token || req?.header("Authorization").replace("Bearer ", "");
console.log(token);
        let decodedata=jwt.verify(token,process.env.JWT_SECRET)
        console.log("decoded",decodedata);
        req.userid=decodedata?.id;
        next();
    } catch (error) {
        console.log("error in middle ware",error.message)
    }
}
export default auth;