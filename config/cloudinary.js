import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

export const cloudinaryConnect = () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "drd6rio69",
      api_key: process.env.CLOUDINARY_API_KEY || "753723216966348",
      api_secret: process.env.CLOUDINARY_API_SECRET || "PrPBgMFighJXjCKx_TTHktFmSPQ",
    });
    console.log("✅ Cloudinary connected successfully");
  } catch (error) {
    console.error("❌ Cloudinary connection failed:", error);
  }
};
