const eventHelpers = require('../../helpers/event-helpers')
const groupHelpers = require('../../helpers/group-helpers')
const itemHelpers = require('../../helpers/item-helpers')
const markHelpers = require('../../helpers/mark-helpers')
const notificationHelpers = require('../../helpers/notification-helpers')
const studentHelpers = require('../../helpers/student-helpers')

const getControllPanelPage = async (req, res) => {  
    let Event = req.session.event
    let allGroups = await groupHelpers.getAllGroups(Event.EventId)
    let EventDetails = await eventHelpers.getEventDetails(Event.EventId)
    if (req.session.Success) {
        res.render('event/control-panel/control-panel', {
            title: Event.Name, eventHeader: true, Event, createAccout: true, adminHeader: true, EventDetails,
            allGroups, 'Success': req.session.Success
        })
        req.session.Success = false
    } else {
        res.render('event/control-panel/control-panel', {
            title: Event.Name, eventHeader: true, Event, createAccout: true, adminHeader: true, EventDetails,
            allGroups
        })
    }
}

const launchEvent = (req, res) => {  
    eventHelpers.launchEvent(req.body).then((result) => {
        req.session.Success = result.Status ? 'Event Launched to Public' : 'Event Hide from Public'
        res.json(result)
    })
}

const publishResult = (req, res) => {  
    eventHelpers.publishResult(req.body).then((result) => {
        req.session.Success = result.Status ? 'Result Published' : 'Result Hide from Public'
        res.json(result)
    })
}

const changeMarkStatus = (req, res) => {  
    markHelpers.deactiveUploadMark(req.body).then((result) => {
        req.session.event.MarkStatus = result.Status ? req.session.event.MarkStatus : false
        req.session.Success = result.Status ? "Can't Update Mark Status" : 'Mark Status Updated'
        res.json(result)
    })
}

const changeAddStudentStatus = (req, res) => {  
    studentHelpers.changeAddStudentsStatus(req.body).then((response) => {
        if (response.Status) {
            notificationHelpers.sendMessage(req.body.EventId,
                [req.body.GroupId], 'Add Sutdent Option Enabled',
                ("Add Students option is Enabled at " + new Date().toLocaleString('en-US', { timeZone: "Asia/Kolkata" }) + '. Go to Students page for add new students.'),
                "", 'auto')
            req.session.Success = 'Enabled'
            res.json(response)
        } else {
            notificationHelpers.sendMessage(req.body.EventId,
                [req.body.GroupId], 'Add Sutdent Option Disabled',
                ("Add Students option is Disabled at " + new Date().toLocaleString('en-US', { timeZone: "Asia/Kolkata" }) + '.'),
                "", 'auto')
            req.session.Success = 'Disabled'
            res.json(response)
        }
    })
}

const changeEditStudentStatus = (req, res, next) => {  
    studentHelpers.changeEditStudentsStatus(req.body).then((response) => {

        if (response.Status) {
            notificationHelpers.sendMessage(req.body.EventId,
                [req.body.GroupId], 'Edit Sutdent Option Enabled',
                ("Edit Students option is Enabled at " + new Date().toLocaleString('en-US', { timeZone: "Asia/Kolkata" }) + '. Go to Students page for edit students details.'),
                "", 'auto')
            req.session.Success = 'Enabled'
            res.json(response)
        } else {
            notificationHelpers.sendMessage(req.body.EventId,
                [req.body.GroupId], 'Edit Sutdent Option Disabled',
                ("Edit Students option is Disabled at " + new Date().toLocaleString('en-US', { timeZone: "Asia/Kolkata" }) + '.'),
                "", 'auto')
            req.session.Success = 'Disabled'
            res.json(response)
        }
    })
}

const changeChooseItemStatus = (req, res, next) => {  
    itemHelpers.changeChooseItemsStatus(req.body).then((response) => {

        if (response.Status) {
            notificationHelpers.sendMessage(req.body.EventId,
                [req.body.GroupId], 'Choose Items Option Enabled',
                ("Choose items option is Enabled at " + new Date().toLocaleString('en-US', { timeZone: "Asia/Kolkata" }) + '. Go to Items page for Choose items for students.'),
                "", 'auto')
            req.session.Success = 'Enabled'
            res.json(response)
        } else {
            notificationHelpers.sendMessage(req.body.EventId,
                [req.body.GroupId], 'Choose Items Option Disabled',
                ("Choose items option is Disabled at " + new Date().toLocaleString('en-US', { timeZone: "Asia/Kolkata" }) + '.'),
                "", 'auto')
            req.session.Success = 'Disabled'
            res.json(response)
        }
    })
}

module.exports = {
    getControllPanelPage, launchEvent, publishResult, changeMarkStatus, changeAddStudentStatus, changeEditStudentStatus,
    changeChooseItemStatus
}