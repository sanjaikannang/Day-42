import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.CONNECTION_URL, {
     });
    console.log(`MongoDB connected`);
  } catch (error) {
    console.error("mongo DB connection failed!",error);
  }
};

export default connectDB;