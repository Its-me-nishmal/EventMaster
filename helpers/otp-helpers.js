const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const serviceSid = process.env.TWILIO_SERVICE_ID

const dosms = (mobile) => {
    return new Promise(async (resolve, reject) => {
        await client.verify.v2.services(serviceSid).verifications.create({
            to: `+91${mobile}`,
            channel: 'sms'
        }).then((response) => {
            response.valid = true
            resolve(response)
        }).catch((err) => {
            reject(err)
        })

    })
}

const otpVerify = (otp, mobile) => {
  
    return new Promise(async (resolve, reject) => {
        try {
            await client.verify.services(serviceSid).verificationChecks.create({
                to: `+91${mobile}`,
                code: otp
            }).then((verification) => {
                resolve(verification.valid)
            }).catch((err) => {
                reject(err)
            })     
        } catch (error) {
            reject(err)
        }
    })
}

module.exports = { dosms, otpVerify }  