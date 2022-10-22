const twit = require('twit')
const config = require("./config")

const Twitter = new twit(config);

const retweet = function (offset) {

  // console.log({stream})
  const params = {
    q: '#aiart', // REQUIRED
    result_type: 'recent',
    lang: 'en'
  }

  Twitter.get('search/tweets', params, (err, data) => {
    if (offset >= data.statuses.length) return;
    // creates a list of tweets and sorts it from most to less engaged (fav & rt count)
    const tweets = data.statuses.map((tweet) => {
      let banned = false;
      for(let i=0;i<tweet.entities.hashtags.length;i++){
        let lowerText = tweet.entities.hashtags[i].text.toLowerCase();
        if(lowerText === "waifudiffusion") banned = true;
      }
      return !banned ? tweet : null;
    }).sort((a, b) => {
      return (b.retweet_count + b.favorite_count) - (a.retweet_count + a.favorite_count)
    });
    
    if (!err) {
      // gets the list's top tweet
      const retweetId = tweets[offset].id_str;
      Twitter.post('statuses/retweet/:id', {
        id: retweetId
      }, (err, res) => {
        if (err && err.code === 327) {
          // if the tweet has already been retweeted by the bot, starts again with next index
          retweet(offset + 1)
        } else if (err && err.code !== 327) {
          Twitter.post('statuses/update', {
            status: `@tomasfrancizco h${Math.floor(Math.random() * 1337)}y!`
          }, (err, res) => {})
        }
      })
    }
  })
}

retweet(0)