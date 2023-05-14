const eventHelpers = require("../../helpers/event-helpers")
const groupHelpers = require("../../helpers/group-helpers")
const itemHelpers = require("../../helpers/item-helpers")
const { dosms, otpVerify } = require('../../helpers/otp-helpers')
const studentHelpers = require("../../helpers/student-helpers")

// Create Event
const getPageOne = (req, res) => {  ////
    res.render('event/auth/create-1', { title: 'Create event', createAccout: true, adminHeader: true })
}

const postPageOne = (req, res) => {  ////
    eventHelpers.sessionOneStore(req.body).then((data) => {
        res.render('event/auth/create-2', { title: 'Create event', createAccout: true, adminHeader: true, ...data })
    })
}
const postPageTwo = (req, res) => {  ////
    eventHelpers.sessionTwoStore(req.body).then((data) => {
        res.render('event/auth/create-3', { title: 'Create event', createAccout: true, adminHeader: true, ...data })
    })
}
const postPageThree = (req, res) => {  ////  
    eventHelpers.sessionThreeStore(req.body).then((EventId) => {
        res.render('event/auth/create-4', { title: 'Create event', createAccout: true, adminHeader: true, EventId })
    })
}
const postPageFour = (req, res) => {  ////
    eventHelpers.sessionFourStore(req.body).then(() => {
        res.redirect('/admin')
    })
}

// Login Event
const getEventLogin = (req, res) => {  ////
    if (req.session.admin) {
        res.redirect('/admin')
    } else if (req.session.Error) {
        res.render('event/auth/login', { title: 'Event Login', adminHeader: true, Error: req.session.Error })
        req.session.Error = false
    } else {
        res.render('event/auth/login', { title: 'Event Login', adminHeader: true })
    }
}

const postEventLogin = (req, res) => {  ////
    let { EventId } = req.body
    eventHelpers.EventLogin(req.body).then((response) => {
        if (response.event) {
            req.session.event = response.event
            res.redirect('/event/' + EventId + '/dashboard')
        } else if (response.EventIdErr) {
            req.session.Error = "Incorrect EventId"
            req.session.admin
                ? res.redirect('/admin')
                : res.redirect('/event/login')
        } else {
            req.session.Error = "Incorrect Password"
            req.session.admin
                ? res.redirect('/admin')
                : res.redirect('/event/login')
        }
    })
}

const getEventLogOut = (req, res) => {  ////
    const EventId = req.params.EventId
    if (req.session.event.EventId === EventId) {
        req.session.event = false
        req.session.admin ? res.redirect('/admin') : res.redirect('/event/login')
    } else {
        req.session.admin ? res.redirect('/admin') : res.redirect('/event/login')
    }
}


// Forgot Password
const getForgotPasswordPage = (req, res) => {  ////
    if (req.session.Error) {
        res.render('event/auth/forgot-password', { title: 'College Fest', admin: true, adminHeader: true, "Error": req.session.Error })
        req.session.Error = false
    } else {
        res.render('event/auth/forgot-password', { title: 'College Fest', admin: true, adminHeader: true })
    }
}

const postForgotPassword = (req, res) => {  ////

    eventHelpers.getEventDetails(req.body.EventId).then((Details) => {
      
        if (Details?.Mobile) {
            req.session.ForgotMobile = Details.Mobile
            req.session.ForgotEventId = Details.EventId
            dosms(Details.Mobile).then((response) => {
                if (response.valid) {
                    res.redirect('/event/forgot-password/otp')
                } else {
                    req.session.Error = 'Some Error'
                    res.redirect('/event/forgot-password')
                }
            })

        } else {
            req.session.Error = 'Invalid EventId '
            res.redirect('/event/forgot-password')

        }
    })

}

const getForgotPasswordOtpPage = (req, res) => {  ////
    let mobileSlice = req.session.ForgotMobile.slice(6)
    let mobile = req.session.ForgotMobile
    if (req.session.Error) {
        res.render('event/auth/otp-page', { title: 'College Fest', admin: true, adminHeader: true, mobileSlice, mobile, "Error": req.session.Error })
        req.session.Error = false
    } else {
        res.render('event/auth/otp-page', { title: 'College Fest', admin: true, adminHeader: true, mobileSlice, mobile })
    }
}

const postForgotPasswordOtpPage = (req, res) => {  ////
    let mobile = req.params.mobile
    let otp = req.body.otp
    otpVerify(otp, mobile).then((response) => {
        if (response.valid) {
            res.redirect('/event/forgot-password/set-password')
        } else {
            req.session.Error = 'Incorrect Otp'
            res.redirect('/event/forgot-password/otp')
        }
    })
}

const getForgotpasswordSetPage = (req, res) => {  ////
    let EventId = req.session?.ForgotEventId
    if (EventId) {
        res.render('event/auth/new-password', { title: 'College Fest', admin: true, adminHeader: true, mobileSlice, mobile })
    } else {
        res.redirect('/event/forgot-password')
    }
}



// Dashboard

const getDashboard = async (req, res) => {  ////
    const Event = JSON.parse(JSON.stringify(req.session.event))
   
    // Checking  
    const PointCategory = await eventHelpers.getPointsCount(Event.EventId)
    const isGroupActive = await groupHelpers.isAllGroupActive(Event.EventId)
    let isStudentLimit = await itemHelpers.getAllItemCategory(Event.EventId)  
    isStudentLimit = isStudentLimit[0].Sub[0].Limit === 0 ? false : true
    let statusViewEvent = await eventHelpers.statusViewEvent(Event.EventId)
    let EventDetails = await eventHelpers.getEventDetails(Event.EventId)
    const StudentsCount = await studentHelpers.totalStudentsCount(Event.EventId)
    const ItemCount = await itemHelpers.AllItemCount(Event.EventId)
    Event.Date = new Date(Event.Date).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });

    res.render('event/dashboard/dashboard', {
        title: Event.Name, Event, eventHeader: true, createAccout: true, adminHeader: true,
        PointCategory, isGroupActive, statusViewEvent, isStudentLimit, EventDetails, StudentsCount, ItemCount
    })
}
module.exports = {
    getForgotPasswordPage, postForgotPassword, getForgotPasswordOtpPage, postForgotPasswordOtpPage,
    getForgotpasswordSetPage, getPageOne, postPageOne, postPageTwo, postPageThree, postPageFour,
    postEventLogin, getEventLogin, getEventLogOut, getDashboard
}