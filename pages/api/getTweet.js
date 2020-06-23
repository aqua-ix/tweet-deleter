const Twitter = require("twitter");

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

const getTweet = async (req, res) => {
  const params = {
    count: 20,
    exclude_replies: true,
    include_rts: false,
  };

  await client.get(
    "statuses/user_timeline",
    params,
    (error, tweets, response) => {
      // tweets.filter((item, index) => {
      //     if(item.created_at > )
      // })
      if (!error) {
        res.status(200).json(tweets);
      }
    }
  );
};

export default getTweet;
