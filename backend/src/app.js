import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";

const app=express();

console.log("process.env.CORS_ORIGIN",process.env.CORS_ORIGIN)

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true
    })
);


export {app}