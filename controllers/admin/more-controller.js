const eventHelpers = require('../../helpers/event-helpers')
const groupHelpers = require('../../helpers/group-helpers')
const fs = require('fs');
const path = require('path');
const itemHelpers = require('../../helpers/item-helpers');
const studentHelpers = require('../../helpers/student-helpers');
const notificationHelpers = require('../../helpers/notification-helpers');

const getSettingsPage = (req, res) => {   
    const Event = req.session.event
    res.render('event/more/more', { title: Event.Name, eventHeader: true, Event, createAccout: true, adminHeader: true })
}

// Group Category
const getGroupCategoryLimit = async (req, res) => {   
    let Event = req.session.event
    let allItemCategory = await itemHelpers.getAllItemCategory(Event.EventId)

    res.render('event/more/group-category', {
        title: Event.Name, eventHeader: true, Event, createAccout: true, adminHeader: true, allItemCategory
    })
}

const postGroupCategoryLimit = (req, res) => {   
    let EventId = req.params.EventId
    studentHelpers.addGroupCategoryLimit(EventId, req.body).then(() => {
        res.redirect('/event/' + EventId + '/group-category')
    })
}

// Event
const getEventSettingsPage = async (req, res) => {   
    let Event = req.session.event
    let AllGroups = await groupHelpers.getAllGroups(Event.EventId)

    if (req.session.Error) {

        res.render('event/more/event-settings', {
            title: Event.Name, eventHeader: true, Event, createAccout: true, adminHeader: true,
            "Error": req.session.Error, AllGroups
        })
        req.session.Error = false
    } else if (req.session.Success) {

        res.render('event/more/event-settings', {
            title: Event.Name, eventHeader: true, Event, createAccout: true, adminHeader: true,
            "Success": req.session.Success, AllGroups
        })
        req.session.Success = false
    } else {

        res.render('event/more/event-settings', {
            title: Event.Name, eventHeader: true, Event, createAccout: true, adminHeader: true,
            AllGroups
        })
    }
}

const uploadEventImage = (req, res) => {   
    let EventId = req.params.EventId
    let image = req.files.profile
    image.mv('./public/images/event-logo/' + EventId + '.jpg')
    res.redirect('/event/' + EventId + '/event-settings')
}

const editEventDetails = (req, res) => {   
    let EventId = req.params.EventId
    eventHelpers.editEventDetails(req.body).then(() => {

        req.session.event.Name = req.body.Name
        req.session.event.Date = req.body.Date
        req.session.event.Convener = req.body.Convener
        req.session.event.Mobile = req.body.Mobile
        req.session.Success = 'Details Updated'
        res.redirect('/event/' + EventId + '/event-settings')
    })
}

const changeEventPassword = (req, res) => {   
    let EventId = req.params.EventId
    eventHelpers.changePassword(req.body).then((response) => {

        if (response) {
            req.session.Success = "Password Upadated"
            res.redirect('/event/' + EventId + '/event-settings')
        } else {
            req.session.Error = "Incorrect Corrent password"
            res.redirect('/event/' + EventId + '/event-settings')
        }
    })
}

const getEditGroupDetails = async (req, res) => {   
    let Event = req.session.event
    let GroupId = req.params.GroupId
    let GroupDetails = await groupHelpers.getGroupDetails(GroupId, Event.EventId)

    res.render('event/more/edit-group-details', {
        title: Event.Name, eventHeader: true, Event, createAccout: true, adminHeader: true,
        GroupDetails
    })
}

const postEditGroupDetails = (req, res) => {   
    let EventId = req.params.EventId
    groupHelpers.editGroupDetails(EventId, req.body).then((response) => {
        notificationHelpers.sendMessage(EventId,
            [req.body.GroupId], 'Refresh Now !',
            ("Your Group Details updated on " + new Date().toLocaleString('en-US', { timeZone: "Asia/Kolkata" }) + '. Click for refresh your website to fetch new data'),
            "/group/other", 'auto')
        req.session.Success = "Group Details Updated"
        res.redirect('/event/' + EventId + '/event-settings')
    })
}

const deleteEvent = (req, res) => {   
    let EventId = req.params.EventId

    eventHelpers.deleteEvent(EventId).then(() => {
        let Imagepath = path.join(__dirname, '../../public/images/event-logo/' + EventId + '.jpg')

        fs.unlink(Imagepath, function (error) {
            req.session.event = null
            req.session.admin
                ? res.redirect('/admin')
                : res.redirect('/event/login')
        })

    })
}

//   Students WithOut Programme
const getStudentsWithOutPrograme = async (req, res) => {   
    let Event = req.session.event
    let Students = await studentHelpers.getAllStudentsWithOutPrograme(Event.EventId)

    res.render('event/more/student-without-program', {
        title: Event.Name, eventHeader: true, Event, createAccout: true, adminHeader: true, Students

    })
}

// Upload File
const getUploadFilePage = async (req, res) => {   
    let Event = req.session.event
    let EventDetails = await eventHelpers.getAllUploadedFiles(Event.EventId)
  
    res.render('event/more/all-files', {
        title: Event.Name, eventHeader: true, Event, createAccout: true, adminHeader: true,
        EventDetails
    })
}

const postUploadFile = (req, res) => {   
    const Event = req.session.event

    eventHelpers.uploadFiles(req.body, Event.EventId).then(({ FileId }) => {
        notificationHelpers.sendMessage(Event.EventId,
            undefined, (req.body.title + ' File Uploaded'),
            ("New file uploaded about " + req.body.title + ' ' + new Date().toLocaleString('en-US', { timeZone: "Asia/Kolkata" }) + '. Go to Home Page for view.'),
            "", 'auto')
        let pdfFile = req.files.programShedule
        pdfFile.mv('./public/files/' + FileId + req.body.title + '.pdf', (err) => {
            if (!err) {
                res.redirect('/event/' + Event.EventId + '/upload-files')
            } else {
                res.redirect('/event/' + Event.EventId + '/upload-files')
                
            }
        })
    })
}

const deleteUploadFile = (req, res) => {   

    let Event = req.session.event
    let Title = req.params.Title
    let FileId = req.params.FileId
    eventHelpers.deleteUploadFile(FileId, Event.EventId).then(() => {

        let pdfPath = path.join(__dirname, '../../public/files/' + FileId + "" + Title + '.pdf')
        fs.unlink(pdfPath, function (error) {
            res.redirect('/event/' + Event.EventId + '/upload-files')
        })


    })
}

const getNotificationSendPage = async (req, res) => {   
    let Event = req.session.event
    let AllGroups = await groupHelpers.getAllGroups(Event.EventId)
    if (req.session.Success) {
        res.render('event/more/send-notifications', {
            title: Event.Name, eventHeader: true, Event, createAccout: true, adminHeader: true,
            AllGroups, "Success": req.session.Success
        })
        req.session.Success = false
    } else {
        res.render('event/more/send-notifications', {
            title: Event.Name, eventHeader: true, Event, createAccout: true, adminHeader: true,
            AllGroups
        })
    }
}

const postNotificationSend = (req, res) => {   
    let Event = req.session.event
    req.body.GroupId = typeof req.body?.GroupId === 'string' ? [req.body.GroupId] : req.body.GroupId
    notificationHelpers.sendMessage(Event.EventId, req.body.GroupId, req.body.Subject, req.body.Content, req.body.Link).then((response) => {

        if (response) {
            req.session.Success = 'Message sended'
            res.redirect('/event/' + Event.EventId + '/notifications/send')
        } else {
            res.redirect('/event/' + Event.EventId + '/notifications/send')
        }
    })
}

const getAllNotifications = async (req, res) => {   
    const Event = req.session.event
    const AllGroups = await groupHelpers.getAllGroups(Event.EventId)
    res.render('event/more/all-notifications', {
        title: Event.Name, eventHeader: true, Event, createAccout: true, adminHeader: true,
        AllGroups
    })
}

const getGroupBaiseNotifications = async (req, res) => {   
    const Event = req.session.event
    const GroupId = req.params.GroupId
    const GroupName = req.params.GroupName
    const Notifications = await groupHelpers.getGroupNotifications(Event.EventId, GroupId)

    res.render('event/more/group-notifications', {
        title: Event.Name, eventHeader: true, Event, createAccout: true, adminHeader: true, Notifications, GroupName, GroupId
    })
}

const viewOneNotification = async (req, res) => {   
    const Event = req.session.event
    const MessageId = req.params.MessageId
    const Message = await notificationHelpers.getOneMessageWithOutGroupId(Event.EventId, MessageId)
    res.render('event/more/view-notification', {
        title: Event.Name, eventHeader: true, Event, createAccout: true, adminHeader: true, Message
    })
}

const deleteMessageFromAll = (req, res) => {   
    const Event = req.session.event
    const MessageId = req.params.MessageId
    const GroupId = req.params.GroupId
    notificationHelpers.deleteNotificationFromAll(Event.EventId, MessageId).then(() => {
        res.redirect('/event/' + Event.EventId + '/notifications/' + GroupId)
    })

}

const deleteMessageFromOne = (req, res) => {   
    const Event = req.session.event
    const MessageId = req.params.MessageId
    const GroupId = req.params.GroupId
    notificationHelpers.deleteNotificationFormOne(Event.EventId, GroupId, MessageId).then(() => {
        res.redirect('/event/' + Event.EventId + '/notifications/' + GroupId)
    })
}
module.exports = {
    getSettingsPage, getGroupCategoryLimit, postGroupCategoryLimit, uploadEventImage, editEventDetails, getEventSettingsPage,
    changeEventPassword, getEditGroupDetails, postEditGroupDetails, deleteEvent, getStudentsWithOutPrograme, getUploadFilePage,
    postUploadFile, deleteUploadFile, getNotificationSendPage, postNotificationSend, getAllNotifications, getGroupBaiseNotifications,
    viewOneNotification, deleteMessageFromAll, deleteMessageFromOne

}