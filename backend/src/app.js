import 'dotenv/config';
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import passport from 'passport';

import {ApiError} from "./utils/ApiError.js"

const app=express();

console.log("process.env.CORS_ORIGIN",process.env.CORS_ORIGIN)

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true
    })
);

//common middlewares
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({ extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// google auth passport config
import "./config/passport.config.js"; 
app.use(passport.initialize());

//import routes
import userRouter from "./routes/user.routes.js"
import healthRouter from "./routes/healthcheck.routes.js"

//routes
app.use("/api/healthcheck",healthRouter)
app.use("/api/users",userRouter)


app.use((err, req, res, next) => {
    if (err instanceof ApiError) { // Catches the ApiError you threw
      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
    }
  
    // Handle other unexpected errors
    console.error("UNHANDLED ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  });

export {app}