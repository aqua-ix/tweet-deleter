const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.setupUser = functions.auth.user().onCreate((user) => {});

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
