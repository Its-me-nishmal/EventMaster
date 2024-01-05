const mongoClient = require('mongodb').MongoClient

// DB
const state = {
    db: null

}

module.exports.connect = function (done) {
    const url = 'mongodb+srv://alltrackerx:Nichuvdr%40786@cluster0.zqjk0it.mongodb.net/NSA?retryWrites=true&w=majority'
    const dbname = 'NSA'




    mongoClient.connect(url, (err, data) => {
        if (err) return done(err)
        state.db = data.db(dbname)
        done()
    })

}

module.exports.get = function () {
    return state.db
}

