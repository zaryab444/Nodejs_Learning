const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
    mongoClient.connect('mongodb+srv://sohailzaryab61:oRrCo3gi7Hyzzvf8@cluster0.vxg4vcp.mongodb.net/?retryWrites=true&w=majority').then(result => {
        console.log('Connected!');
        callback(result);
    }).catch(err =>{
        console.log(err);
    });
};

module.exports = mongoConnect;