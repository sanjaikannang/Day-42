import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";

import users from "../models/auth.js";
import transporter from '../nodemailerConfig.js'; 

//  sign up 
export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existinguser = await users.findOne({ email });
    if (existinguser) {
      return res.status(404).json({ message: "User already Exist." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await users.create({
      name,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "10h" }
    );
    res.status(200).json({ result: newUser, token });
  } catch (error) {
    res.status(500).json("Something went worng...");
  }
};

//  login 
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existinguser = await users.findOne({ email });
    if (!existinguser) {
      return res.status(404).json({ message: "User don't Exist." });
    }
    const isPasswordCrt = await bcrypt.compare(password, existinguser.password);
    if (!isPasswordCrt) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { email: existinguser.email, id: existinguser._id },
      process.env.JWT_SECRET,
      { expiresIn: "10h" }
    );
    res.status(200).json({ result: existinguser, token });
  } catch (error) {
    res.status(500).json("Something went worng...");
  }
};

// Generate and send a reset password link to the user's email
export const forgotpassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await users.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Generate a reset token and set the expiration date
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiration = new Date();
    resetTokenExpiration.setHours(resetTokenExpiration.getHours() + 1); // Token is valid for 1 hour

    // Store the reset token and expiration date in the user's document
    user.resetToken = resetToken;
    user.resetTokenExpiration = resetTokenExpiration;
    await user.save();

    // Send an email with a link that includes the reset token
    const resetPasswordLink = `${process.env.FRONTEND_URL}/${resetToken}`;

    // Use Nodemailer to send the email
    const mailOptions = {
      from: 'your-email@gmail.com', // Replace with your email
      to: email,
      subject:'Password Reset Link',
      text: `Click the following link to reset your password: ${resetPasswordLink}`,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error(error);
        res.status(500).json({ message: "Email could not be sent." });
      } else {
        res.status(200).json({ message: "Password reset link sent to your email." });
      }
    });
  } catch (error) {
    console.error("Error in forgotpassword route:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

// Reset the user's password using the reset token
export const resetpassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ message: "New password is required." });
  }

  try {
    const user = await users.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: new Date() },
    });

    if (!user) {
      return res.status(404).json({ message: "Invalid or expired reset token." });
    }

    // Hash and update the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiration = null;
    await user.save();

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Error in resetpassword route:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

  
