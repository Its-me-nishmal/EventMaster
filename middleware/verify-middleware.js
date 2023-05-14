const groupHelpers = require('../helpers/group-helpers');
const eventHelpers = require('../helpers/event-helpers');

const verifyActiveEvent = async (req, res, next) => {
    const event = await eventHelpers.getEventDetails(req.params.EventId)
    if (event?.Launch && event?.ResultPublish) {
        delete event.BuildStage
        delete event.Files
        delete event.Mobile
        delete event.EmailId
        req.session.e = event
        next()  
    } else if (event?.Launch && !event?.ResultPublish) {
        delete event.BuildStage
        delete event.Files
        delete event.Mobile
        delete event.EmailId
        req.session.e = event
        let eventDetails = req.session.e
        res.render('user/home/unPublishPage', {title:event.Name, eventDetails, footer: true })
    } else {
        res.redirect('/')
    }
};

const verifyGroupLogin = async (req, res, next) => {////

    if (req.session.group) {
        let Group = req.session.group
        let GroupDetails = await groupHelpers.getGroupDetails(Group.GroupId, Group.EventId)

        if (GroupDetails) {
            next()
        } else {
            req.session.group = null
            res.redirect('/group/login')
        }
    } else {
        res.redirect('/group/login')
    }
};

const verifyAdminLogin = (req, res, next) => {   ////
    if (req.session.admin) {
        next()
    } else {
        res.redirect('/admin/login')
    }
};

const verifyEventLogin = (req, res, next) => {  ////
    if (req.session.event) {
        next()
    } else {
        req.session.admin
            ? res.redirect('/admin')
            : res.redirect('/event/login')
    }
};


module.exports = { verifyActiveEvent, verifyGroupLogin, verifyAdminLogin, verifyEventLogin }