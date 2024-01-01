const mongoClient = require('mongodb').MongoClient

// DB
const state = {
    db: null

}

module.exports.connect = function (done) {
    const url = 'mongodb+srv://alltrackerx:Nichuvdr%40786@cluster0.zqjk0it.mongodb.net/Event?retryWrites=true&w=majority'
    const dbname = 'event'




    mongoClient.connect(url, (err, data) => {
        if (err) return done(err)
        state.db = data.db(dbname)
        done()
    })

}

module.exports.get = function () {
    return state.db
}

