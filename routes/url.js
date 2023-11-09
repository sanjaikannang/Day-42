import express from "express";
import auth from "../middleware/auth.js"
import  { redirectToOriginalUrl,createShortUrl } from "../controllers/url.js"

const router = express.Router();

router.post("/short",auth, createShortUrl);
router.get("/:shortUrl", auth,redirectToOriginalUrl);

export default router;