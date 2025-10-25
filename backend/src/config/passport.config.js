import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.model.js"; 
import crypto from "crypto";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.API_BASE_URL || 'http://localhost:8000'}/api/v1/users/auth/google/callback`,
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
          name: profile.displayName,
          googleId: profile.id, // Store the Google ID
          avatar: profile.photos[0].value,
          isEmailVerified: true, // They verified with Google
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