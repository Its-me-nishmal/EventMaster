const eventHelpers = require("../../helpers/event-helpers")
const groupHelpers = require("../../helpers/group-helpers")
const notificationHelpers = require("../../helpers/notification-helpers")

const getNotifiMainPage = async (req, res) => { 
  let Group = req.session.group
  let GroupDetails = await groupHelpers.getGroupDetails(Group.GroupId, Group.EventId)
  let Notifications = GroupDetails.Notifications.map(notifi => {
    return {
      ...notifi,
      Date: notifi.Date.toLocaleString('en-US', { timeZone: "Asia/Kolkata" })
    }
  }).reverse();

  res.render('group/notifi/mainPage', { title: Group.GroupName, group: true, groupHeader: true, Group, Notifications })
}

const showNotifi = (req, res) => { 
  let Group = req.session.group
  notificationHelpers.sawNotification(req.body, Group.EventId).then(() => {
    res.json()
  })
}

const readOneNotifi = (req, res) => { 
  let Group = req.session.group
  notificationHelpers.readOneNotification(req.body, Group.EventId).then((response) => {
    res.json(response)
  })
}

const deleteOneNotifi = (req, res) => { 
  let Group = req.session.group
  notificationHelpers.clearOneNotification(req.body, Group.EventId).then((response) => {
    res.json(response)
  })
}

const readAllNotifi = (req, res) => { 
  let Group = req.session.group
  notificationHelpers.readFullNotification(req.body, Group.EventId).then((response) => {
    res.json(response)
  })
}

const viewNotifi = async (req, res) => { 
  let Group = req.session.group
  const EventDetails = await eventHelpers.getEventDetails(Group.EventId)
  let MessageId = req.params.MessageId
  let Message = await notificationHelpers.getOneMessage(Group.EventId, Group.GroupId, MessageId)
  res.render('group/notifi/view-notification', {
    title: Group.GroupName, group: true, groupHeader: true, Group, EventDetails, Message
  })
}



module.exports = { getNotifiMainPage, showNotifi, readOneNotifi, deleteOneNotifi, readAllNotifi, viewNotifi }