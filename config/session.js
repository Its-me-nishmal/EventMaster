const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);
const MongoURI = "mongodb+srv://alltrackerx:Nichuvdr%40786@cluster0.zqjk0it.mongodb.net/Event?retryWrites=true&w=majority"


// Session
const store = new MongoDBSession({
    uri: MongoURI,
    collection: 'event',

})

module.exports = { store };
