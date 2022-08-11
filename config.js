require('dotenv').config();
module.exports = {
  consumer_key: process.env.TW_CONSUMER_KEY,  
  consumer_secret: process.env.TW_CONSUMER_SECRET,
  access_token: process.env.TW_ACCESS_TOKEN,  
  access_token_secret: process.env.TW_ACCESS_TOKEN_SECRET
}