const adminHelpers = require('../helpers/admin-helpers')

const getLoginPage = (req, res) => {

    if (req.session.admin) {
        res.redirect('/admin')
    } else if (req.session.loginErr) {
        res.render('admin/login', { "loginErr": req.session.loginErr, title: 'Admin login', adminHeader: true })
        req.session.loginErr = false
    } else if (req.session.Success) {
        res.render('admin/login', { "Success": req.session.Success, title: 'Admin login', adminHeader: true })
        req.session.Success = false
    } else {
        res.render('admin/login', { adminHeader: true, title: 'Admin login' })
    }
}
const postLogin = (req, res) => {

    adminHelpers.adminLogin(req.body).then((response) => {
        if (response.adminDetails) {
            req.session.admin = true
            req.session.EmailErr = false
            req.session.PasswordErr = false
            req.session.admin = response.adminDetails

            res.redirect('/admin')
        } else if (response.EmailErr) {
            req.session.EmailErr = true
            req.session.loginErr = "Invalid email address"
            res.redirect('/admin/login')
        } else {
            req.session.loginErr = "Incorrect password"
            res.redirect('/admin/login')
        }
    })
}
const getLogOut = (req, res) => {
    req.session.admin = null
    req.session.fest = null
    res.redirect('/admin')
}

// Account
const getAccount = async (req, res) => {

    const adminDetails = req.session.admin
    if (req.session.passwordChangeErr) {
        res.render('admin/admin-account', { title: 'College fest', admin: true, adminHeader: true, adminDetails, "passwordChangeErr": req.session.passwordChangeErr, footer: true })
        req.session.passwordChangeErr = false
    } else if (req.session.passwordChangeSuccess) {
        res.render('admin/admin-account', { title: 'College fest', admin: true, adminHeader: true, adminDetails, "passwordChangeSuccess": req.session.passwordChangeSuccess, footer: true })
        req.session.passwordChangeSuccess = false
    } else {
        res.render('admin/admin-account', { title: 'College fest', admin: true, adminHeader: true, adminDetails, footer: true })
    }
}

const postChangePassword = (req, res) => {
    adminHelpers.changePassword(req.body).then((response) => {
        if (response) {
            req.session.passwordChangeSuccess = "Password Changed"
            res.redirect('/admin/change-password')
        } else {
            req.session.passwordChangeErr = "Incorrect Corrent password"
            res.redirect('/admin/change-password')
        }
    })
}

const getForgotPassword = (req, res) => {
    if (req.session.Error) {
        res.render('admin/forgot-password', { "loginErr": req.session.Error, title: 'Admin login', adminHeader: true })
        req.session.Error = false
    } else {
        res.render('admin/forgot-password', { title: 'Admin login', adminHeader: true })
    }
}

const postForgotPassword = (req, res) => {
    adminHelpers.sendOtpMail(req.body).then((response) => {
        if (response.EmailErr) {
            req.session.Error = "Invalid e-mail address"
            res.redirect('/admin/forgot-password')
        } else if (response) {
            res.redirect('/admin/forgot-password/otp/' + req.body.EmailId)
        }
        res.redirect('/')
    })
}

const getForgotOtpToEmail = (req, res) => {
    let EmailId = req.params.EmailId
    if (req.session.Error) {
      res.render('admin/otp', { title: 'Admin login', adminHeader: true, EmailId, "loginErr": req.session.Error })
      req.session.Error = false
    } else[
      res.render('admin/otp', { title: 'Admin login', adminHeader: true, EmailId, })
  
    ]
  }

module.exports = {
    getLoginPage, postLogin, getLogOut, getAccount, postChangePassword, getForgotPassword, postForgotPassword,
    getForgotOtpToEmail
}