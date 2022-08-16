const twit = require('twit')
const config = require("./config")

const Twitter = new twit(config);

const retweet = function (offset) {
  const params = {
    q: '#aiart', // REQUIRED
    result_type: 'recent',
    lang: 'en'
  }

  Twitter.get('search/tweets', params, (err, data) => {
    if(offset >= data.statuses.length) return;
    // creates a list of tweets and sorts it from most to less engaged (fav & rt count)
    const tweets = data.statuses.map((tweet) => {
      return tweet
    }).sort((a, b) => {
      return (b.retweet_count + b.favorite_count) - (a.retweet_count + a.favorite_count)
    })

    if (!err) {
      // gets the list's top tweet
      const retweetId = tweets[offset].id_str;
      Twitter.post('statuses/retweet/:id', {
        id: retweetId
      }, (err, res) => {
        if (err && err.code === 327) {
          // if the tweet has already been retweeted by the bot, starts again with next index
          retweet(offset + 1)
        } else if(err && err.code !== 327) {
          Twitter.post('statuses/update', {
            status: `@tomasfrancisco h${Math.floor(Math.random() * 1337)}y!`
          }, (err, res) => {}
          )
        }
      })
    }
  })
}

retweet(0);


