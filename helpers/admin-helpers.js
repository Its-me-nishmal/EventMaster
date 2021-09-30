var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
var objectId = require('mongodb').ObjectID
const { reject, resolve } = require('promise')
const { response } = require('express')

module.exports = {

    adminLogin: (adminData) => {

        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ EmailId: adminData.EmailId })

            if (admin) {

                bcrypt.compare(adminData.Password, admin.Password).then((status) => {
                    if (status) {
                        response.adminDetails = admin
                        response.status = true
                        response.EmailErr = false
                        response.PasswordErr = false
                        resolve(response)

                    } else {
                        resolve({ PasswordErr: true })

                    }

                })
            } else {
                resolve({ EmailErr: true })


            }
        })
    },

    getAdminDetails: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ADMIN_COLLECTION).find().toArray().then((response) => {
                resolve(response)
            })
        })

    },

    changePassword: (body) => {
       
        return new Promise(async(resolve, reject) => {

            let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ UserName: body.UserName })

            if (admin) {

                bcrypt.compare(body.CurrentPassword, admin.Password).then(async (status) => {

                    if (status) {

                        passwordNew = await bcrypt.hash(body.Password, 10)

                        db.get().collection(collection.ADMIN_COLLECTION).updateOne({ UserName: body.UserName },
                            {
                                $set: {
                                    Password: passwordNew
                                }
                            }).then((response) => {

                                resolve({passwordSuccess : true})

                            });

                    } else {
                        resolve()
                    }
                })
            }
        })

    }



}