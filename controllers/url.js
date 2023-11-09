import ShortUrl from "../models/shortStore.js";

// create full URL to short url 
export const createShortUrl = async (req, res) => {
    const { full } = req.body;
  
    try {
      const existingShortUrl = await ShortUrl.findOne({ full });
  
      if (existingShortUrl) {
        res.status(200).json(existingShortUrl);
      } else {
        const newShortUrl = await ShortUrl.create({ full });
        res.status(201).json(newShortUrl);
      }
    } catch (error) {
      console.error('Error creating short URL:', error);
      res.status(500).json({ message: 'Something went wrong.' });
    }
  };
  
// redirect To Original Url
export const redirectToOriginalUrl = async (req, res) => {
    const { shortUrl } = req.params;
  
    try {
      const short = await ShortUrl.findOne({ short: shortUrl });
  
      if (short) {
        res.redirect(short.full);
      } else {
        res.status(404).json({ message: 'Short URL not found' });
      }
    } catch (error) {
      console.error('Error redirecting to original URL:', error);
      res.status(500).json({ message: 'Something went wrong.' });
    }
  };