var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
var nodemailer = require('nodemailer')


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

        return new Promise(async (resolve, reject) => {

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

                                resolve({ passwordSuccess: true })

                            });

                    } else {
                        resolve()
                    }
                })
            }
        })

    },

    createAccout: (body) => {
        return new Promise(async (resolve, reject) => {
            body.Password = await bcrypt.hash(body.Password, 10)
            db.get().collection(collection.ADMIN_COLLECTION).insertOne(body).then((response) => {
                resolve(response)
            })
        })

    },

    sendOtpMail: (body) => {
        return new Promise(async (resolve, reject) => {
            let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ EmailId: body.EmailId })
            if (admin) {
                let otp = null
                var tranasporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: "dreamsart3@gmail.com",
                        pass: "8089228324"
                    }
                });
                create_random_id(4)
                function create_random_id(sting_length) {
                    var randomString = '';
                    var numbers = '123456789'
                    for (var i, i = 0; i < sting_length; i++) {
                        randomString += numbers.charAt(Math.floor(Math.random() * numbers.length))
                    }
                    otp = randomString
                }
                var mailOptions = {
                    from: 'dreamsart3@gmail.com',
                    to: admin.EmailId,
                    subject: 'Forgot password OTP',
                    html: `<div style="background-color: teal; width:100%; border-radius:15px; padding:20px; color:white;" >
                    <h3 style="text-align: center;">NSA ONLINE</h3><h4 style="text-align: center; font-style:italic; 
                    font-weight:normal;">Fest admin account forgot password OTP sended</h4><h2 style="margin-top: 20px;
                     text-align:center;">OTP : ` + otp + `</h2></div > `
                }
                tranasporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                     db.get().collection(collection.ADMIN_COLLECTION).updateOne({ EmailId: body.EmailId },{
                         $set:{
                             otp : otp
                         }
                     }).then(()=>{
                         console.log("Email sent : " + info.response);
                         resolve(otp)
                     })
                    }
                })

            } else {
                resolve({ EmailErr: true })
            }
        })

    },

    checkOTP:(body)=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ADMIN_COLLECTION).findOne({EmailId:body.EmailId,otp:body.otp}).then((result)=>{
                if(result){
                    resolve(result)
                }else{
                    resolve({Error:true})
                }
            })
        })
        
    },

    newadminPassword:(body)=>{
        console.log(body);
        return new Promise(async(resolve, reject) => {
            let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ EmailId: body.EmailId })

            if (admin) {
               
                        passwordNew = await bcrypt.hash(body.Password, 10)

                        db.get().collection(collection.ADMIN_COLLECTION).updateOne({ EmailId: body.EmailId },
                            {
                                $set: {
                                    Password: passwordNew,
                                    otp : null
                                }
                            }).then((response) => {

                                resolve({ passwordSuccess: true })

                            });

                   
                
            }
        })
        
    }



}