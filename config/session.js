const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);
const MongoURI = "mongodb://localhost:27017/sessions"


// Session
const store = new MongoDBSession({
    uri: MongoURI,
    collection: 'event',

})

module.exports = { store };