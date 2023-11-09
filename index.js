import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./mongoDB.js";
import userRoutes from "./routes/users.js";
import urlRoutes from "./routes/url.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/user", userRoutes);
app.use("/url", urlRoutes);

// app.get('/',(req, res) => {
//     res.send("this is URL shortner API ")
// })

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});