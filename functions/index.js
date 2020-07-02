const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// 自動ツイートbot
// https://qiita.com/Swordroot_M/items/3b9ec5129c323ef32ee0
exports.saveTweetList = export const tweet = functions.pubsub
    .topic('daily-tick')
    .onPublish(async event => {
    try {
        const client = new Twitter(twitter_credentials);
        await client.post('statuses/update', {status: 'test'});
    } catch (error) {
        throw error;
    }
})

// TODO DBからツイートを取得し、除外リスト中のIDを除いて削除する

// TODO Jobを定期実行
// https://developers-jp.googleblog.com/2017/04/how-to-schedule-cron-jobs-with-cloud.html

/* users collection
    tweets
    time
    query
    exclude
    enable
*/
