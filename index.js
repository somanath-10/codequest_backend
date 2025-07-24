import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import userroutes from "./routes/user.js"
import questionroutes from "./routes/question.js"
import answerroutes from "./routes/answer.js"
import authRoutes from './routes/authRoutes.js'
import payment from './routes/payment.js'
import postRoutes from './routes/postRoutes.js'
import friend from './routes/friend.js'
import fileUpload from "express-fileupload"
import { cloudinaryConnect } from "./config/cloudinary.js"
import bodyParser from "body-parser"
import chatRoutes from './routes/chatRoutes.js';
import session from "express-session"
import passport from './config/passport.js'
import googleAuthRoutes from './routes/googleAuth.js'
import publicChatRoutes from "./routes/PublicChat.js";
import cookieParser from "cookie-parser"

const app = express();
const allowedOrigins = [
  "https://codequest-iota.vercel.app", // production
  "http://localhost:3000"              // local dev
];
app.set("trust proxy", 1); // 🔥 Required on Render for secure cookies

app.use(cookieParser());
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true
}));
dotenv.config();
app.use(express.json({ limit: "30mb", extended: true }))
app.use(express.urlencoded({ limit: "30mb", extended: true }))
app.use(
    fileUpload({ 
        useTempFiles:true,                    
		tempFileDir:"/tmp",
	})
)
app.use(bodyParser.json());
const PORT = process.env.PORT || 5000
const database_url = process.env.MONGODB_URL

app.use(
    session({
      secret: process.env.JWT_SECRET,
      resave: false,
      saveUninitialized: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());


app.use('/api', authRoutes);
app.use("/user", userroutes);
app.use('/questions', questionroutes)
app.use('/answer',answerroutes)
app.use('/payment',payment)
app.use('/post',postRoutes);
app.use('/friend',friend);
app.use("/chat", chatRoutes);
app.use("/api/auth", googleAuthRoutes);
app.use("/public-chat", publicChatRoutes);

app.get('/', (req, res) => {
    res.send("Codequest is running perfect")
})

cloudinaryConnect();
mongoose.connect(database_url)
    .then(() => app.listen(PORT, () => { console.log(`server running on port ${PORT}`) }))
    .catch((err) => console.log(err.message))