var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
var objectId = require('mongodb').ObjectID
const { reject, resolve, all } = require('promise')
const { response } = require('express')

module.exports = {

    activeFest:()=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collection.FEST_COLLECTION).findOne({userStatus:1}).then((response)=>{
                resolve(response)
            })
        })
        
    }

}