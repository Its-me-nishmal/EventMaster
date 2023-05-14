const groupHelpers = require('../../helpers/group-helpers')
const eventHelpers = require('../../helpers/event-helpers');
const notificationHelpers = require('../../helpers/notification-helpers')

const getHomePage = async function (req, res) {////
    const Group = req.session.group
    const EventDetails = await eventHelpers.getEventDetails(Group.EventId)
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    EventDetails.Date = EventDetails.Date.toLocaleDateString('en-US', options)
    let GroupCategory = await groupHelpers.getGroupDetails(Group.GroupId, EventDetails.EventId)
    GroupCategory = GroupCategory.Category
    const allFiles = await eventHelpers.getAllUploadedFiles(Group.EventId)

    res.render('group/home/home', {
        title: Group.GroupName, group: true, groupHeader: true, EventDetails, Group, GroupCategory,
        footer: true, allFiles

    })
}

const getNewNotifiCount = (req, res) => {////
    notificationHelpers.getNewNotificaionCount(req.body.EventId, req.body.GroupId).then((response) => {
        res.json(response)
    })
}

module.exports = {
    getHomePage, getNewNotifiCount
}