import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.models.js"; // Using your provided path
import crypto from "crypto";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${
        process.env.API_BASE_URL || "http://localhost:8000"
      }/api/users/auth/google/callback`,
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        let user = await User.findOne({ email });

        if (user) {
          return done(null, user);
        }

        const newUser = await User.create({
          email: email,
          fullname: profile.displayName,
          avatar: profile.photos[0].value,
          verified: true, 
          password: crypto.randomBytes(32).toString("hex"),
        });

        return done(null, newUser); 
      } catch (error) {
        return done(error, false, {
          message: "Failed to authenticate with Google",
        });
      }
    }
  )
);

