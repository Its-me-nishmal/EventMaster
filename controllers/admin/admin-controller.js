const adminHelpers = require('../../helpers/admin-helpers')
const eventHelpers = require('../../helpers/event-helpers')

const getLoginPage = (req, res) => {  ////

    if (req.session.admin) {
        res.redirect('/admin')
    } else if (req.session.Error) {
        res.render('admin/login', { "Error": req.session.Error, title: 'Admin login', adminHeader: true })
        req.session.Error = false
    } else if (req.session.Success) {
        res.render('admin/login', { "Success": req.session.Success, title: 'Admin login', adminHeader: true })
        req.session.Success = false
    } else {
        res.render('admin/login', { adminHeader: true, title: 'Admin login' })
    }
}
const postLogin = (req, res) => {  ////

    adminHelpers.adminLogin(req.body).then((response) => {
        if (response.admin) {
            req.session.admin = response.admin
            res.redirect('/admin')
        } else if (response.EmailErr) {
            req.session.Error = "Invalid email address"
            res.redirect('/admin/login')
        } else {
            req.session.Error = "Incorrect password"
            res.redirect('/admin/login')
        }
    })
}
const getLogOut = (req, res) => {  ////
    req.session.admin = null
    req.session.event = null
    res.redirect('/admin/login')
}

// Account
const getAccount = async (req, res) => {   ////

    const adminDetails = req.session.admin
    res.render('admin/admin-account', { title: 'College fest', admin: true, adminHeader: true, adminDetails, footer: true })

}


// Home

const getHomePage = async (req, res) => {   ////

    let allEvent = await eventHelpers.allEvents()
    let LoginEvent = req.session.event

    if (req.session.Error) {
        res.render('admin/home', {
            title: 'College Fest', admin: true, adminHeader: true, allEvent,
            "Error": req.session.Error, footer: true
        })
        req.session.Error = false
    } else if (req.session.event) {
        res.render('admin/home', {
            title: 'College Fest', admin: true, adminHeader: true, allEvent,
            LoginEvent, footer: true
        })
    } else {
        res.render('admin/home', { title: 'College Fest', admin: true, adminHeader: true, allEvent, footer: true })
    }
}

module.exports = {
    getLoginPage, postLogin, getLogOut, getAccount,  getHomePage
}