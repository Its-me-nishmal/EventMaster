var express = require('express');
var router = express.Router();
var groupHelpers = require('../helpers/group-helpers')
var festHelpers = require('../helpers/fest-helpers');
const { resolve } = require('promise');

const verifyGroupLogin = async (req, res, next) => {

  if (req.session.group) {
    let Group = req.session.group
    let GroupDetails = await groupHelpers.getGroupDetails(Group.GroupId, Group.FestId)

    if (GroupDetails === undefined) {
      req.session.group = null
      res.redirect('/group/login')
    } else {
      next()
    }
  } else {
    res.redirect('/group/login')
  }
};


/* GET home page. */
router.get('/', verifyGroupLogin, async function (req, res, next) {
  var GroupDetails = req.session.group
  var FestDetails = await festHelpers.getFestDetails(GroupDetails.FestId)
  var allStudent = await groupHelpers.getSessionFullStudents(GroupDetails.FestId, GroupDetails.GroupId)
  var studentsCount = allStudent.length
  let allSchedules = await festHelpers.getAllProgramSchedules(GroupDetails.FestId)
  let NewNotifi_Count = await groupHelpers.getNewNotificaionCount(GroupDetails.FestId, GroupDetails.GroupId)
  let letestThreeNotifications = await groupHelpers.getLetest3Notification(GroupDetails.FestId,GroupDetails.GroupId)
  
  res.render('group/home', {
    title: GroupDetails.GroupName, group: true, groupHeader: true, GroupDetails, FestDetails, studentsCount,
    allSchedules, NewNotifi_Count, letestThreeNotifications
  })
});

router.get('/login', (req, res) => {
  if (req.session.group) {
    res.redirect('/group')
  } else if (req.session.grouploginErr) {
    res.render('group/login', { title: 'Group login', groupHeader: true, "grouploginErr": req.session.grouploginErr })
    req.session.grouploginErr = false
  } else {
    res.render('group/login', { title: 'Group login', groupHeader: true, })
  }
});

router.post('/login', (req, res) => {
  groupHelpers.doLogin(req.body).then((response) => {

    if (response.GroupDetails) {
      req.session.group = true
      req.session.groupGroupIdErr = false
      req.session.group = {
        _id: response.GroupDetails._id,
        FestId: response.GroupDetails.FestId,
        GroupName: response.GroupDetails.GroupName,
        GroupId: response.GroupDetails.GroupId,
        Convener: response.GroupDetails.Convener
      }
      res.redirect('/group')
    } else if (response.GroupIdErr) {
      req.session.groupGroupIdErr = true
      req.session.grouploginErr = "Incorrect group id"
      res.redirect('/group/login')
    } else {
      req.session.groupGroupIdErr = false
      req.session.grouploginErr = "Incorrect password"
      res.redirect('/group/login')
    }
  })
});

router.get('/logOut', verifyGroupLogin, (req, res) => {
  req.session.group = null
  res.redirect('/group/login')
});

router.get('/forgetpassword', (req, res) => {

  res.render('group/login')
});


// ......... Students

router.get('/students', verifyGroupLogin, async (req, res) => {
  var GroupDetails = req.session.group
  var NonGeneral = "NonGeneral"
  let NewNotifi_Count = await groupHelpers.getNewNotificaionCount(GroupDetails.FestId, GroupDetails.GroupId)
  groupHelpers.getAllCategorys(GroupDetails).then((result) => {
    let AllSessions = []

    if (result.Session6 !== undefined) {
      AllSessions = [result.Session1, result.Session2, result.Session3, result.Session4, result.Session5, result.Session6]
    } else if (result.Session2 === undefined) {
      AllSessions = [result.Session1]
    } else if (result.Session3 === undefined) {
      AllSessions = [result.Session1, result.Session2]
    } else if (result.Session4 === undefined) {
      AllSessions = [result.Session1, result.Session2, result.Session3]
    } else if (result.Session5 === undefined) {
      AllSessions = [result.Session1, result.Session2, result.Session3, result.Session4]
    } else if (result.Session6 === undefined) {
      AllSessions = [result.Session1, result.Session2, result.Session3, result.Session4, result.Session5]
    }
    res.render('group/students-session', { title: GroupDetails.GroupName, group: true, groupHeader: true, GroupDetails, AllSessions, NonGeneral, NewNotifi_Count })
  })
});

router.get('/students/:SessionName', verifyGroupLogin, async (req, res) => {

  let SessionName = req.params.SessionName
  let GroupDetails = req.session.group
  let SessionDetails = await groupHelpers.getSessionDetails(SessionName, GroupDetails)
  var FestDetails = await festHelpers.getFestDetails(GroupDetails.FestId)
  let GroupFullDetails = await groupHelpers.getGroupDetails(GroupDetails.GroupId, GroupDetails.FestId)
  let AllStudents = await groupHelpers.getAllStudents(SessionName, GroupDetails)
  let StudentsCoutZero = SessionDetails.StudentsCount === 0
  let SessionActivation = SessionDetails.SlNo === null || SessionDetails.SlNo === undefined
  let StudentActiveUndifined = GroupFullDetails.StudentsTime === undefined
  let StudentActiveNull = GroupFullDetails.StudentsTime === null
  let EventLimit = await festHelpers.getStudentEventLimit(GroupDetails.FestId, GroupDetails.GroupId, SessionName)
  let editStatus = GroupFullDetails.editStudentStatus === 1
  let NewNotifi_Count = await groupHelpers.getNewNotificaionCount(GroupDetails.FestId, GroupDetails.GroupId)
  
  if (req.session.cicNOError) {
    res.render('group/all-students', {
      title: GroupDetails.GroupName, group: true, groupHeader: true, NewNotifi_Count, GroupDetails, AllStudents, StudentsCoutZero, SessionName, SessionActivation,
      StudentActiveUndifined, StudentActiveNull, EventLimit, FestDetails, "cicNOError": req.session.cicNOError, editStatus
    })
    req.session.cicNOError = false
  } else if (req.session.studentEventTrueError) {

    res.render('group/all-students', {
      title: GroupDetails.GroupName, group: true, groupHeader: true, NewNotifi_Count, GroupDetails, AllStudents, StudentsCoutZero, SessionName, SessionActivation,
      StudentActiveUndifined, StudentActiveNull, EventLimit, FestDetails, "studentEventTrueError": req.session.studentEventTrueError, editStatus
    })
    req.session.studentEventTrueError = false
  } else {
    res.render('group/all-students', {
      title: GroupDetails.GroupName, group: true, groupHeader: true, NewNotifi_Count, GroupDetails, AllStudents, StudentsCoutZero, SessionName, SessionActivation,
      StudentActiveUndifined, StudentActiveNull, EventLimit, FestDetails, editStatus
    })

  }
});

router.get('/students/:SessionName/add-students', verifyGroupLogin, async (req, res) => {
  let SessionName = req.params.SessionName
  let GroupDetails = req.session.group
  let GroupFullDetails = await groupHelpers.getGroupDetails(GroupDetails.GroupId, GroupDetails.FestId)
  let StudentActiveNull = GroupFullDetails.StudentsTime === null || GroupFullDetails.StudentsTime === undefined
  let NewNotifi_Count = await groupHelpers.getNewNotificaionCount(GroupDetails.FestId, GroupDetails.GroupId)

  if (req.session.cicNOError) {
    res.render('group/add-students', {
      title: GroupDetails.GroupName, group: true, groupHeader: true, GroupDetails,
      SessionName, "cicNOError": req.session.cicNOError, StudentActiveNull,NewNotifi_Count
    })
    req.session.cicNOError = false
  } else if (req.session.cicNoSuccess) {
    res.render('group/add-students', {
      title: GroupDetails.GroupName, group: true, groupHeader: true, GroupDetails,
      SessionName, "cicNoSuccess": req.session.cicNoSuccess, StudentActiveNull, NewNotifi_Count
    })
    req.session.cicNoSuccess = false
  } else {
    res.render('group/add-students', {
      title: GroupDetails.GroupName, group: true, groupHeader: true, GroupDetails, NewNotifi_Count,
      SessionName, StudentActiveNull
    })
  }
});

router.post('/students/:SessionName/add-students', verifyGroupLogin, (req, res) => {
  let SessionName = req.params.SessionName
  let GroupDetails = req.session.group
  groupHelpers.addStudents(SessionName, GroupDetails, req.body).then((response) => {

    if (response) {
      req.session.cicNOError = "This CIC number already used"
      res.redirect('/group//students/' + SessionName + '/add-students')
    } else {
      req.session.cicNoSuccess = "Student added success"
      res.redirect('/group//students/' + SessionName + '/add-students')
    }
  })
});

router.get('/students/:SessionName/:ChestNo/view', verifyGroupLogin, async (req, res) => {
  let SessionName = req.params.SessionName
  let GroupDetails = req.session.group
  let ChestNo = req.params.ChestNo
  var FestDetails = await festHelpers.getFestDetails(GroupDetails.FestId)
  let studentEvents = await festHelpers.getOneStudentEvents(GroupDetails.FestId, GroupDetails.GroupId, SessionName, ChestNo)
  let EventLimit = await festHelpers.getStudentEventLimit(GroupDetails.FestId, GroupDetails.GroupId, SessionName)
  let studentLimitCount = await festHelpers.getStudentEventCount(GroupDetails.FestId, ChestNo)
  let NewNotifi_Count = await groupHelpers.getNewNotificaionCount(GroupDetails.FestId, GroupDetails.GroupId)
  if(req.session.eventDeletError){
    res.render('group/view-student', {
      title: GroupDetails.GroupName, group: true, groupHeader: true, GroupDetails, SessionName, studentEvents, studentLimitCount, EventLimit,
      FestDetails,   NewNotifi_Count , "eventDeletError":req.session.eventDeletError
    })
    req.session.eventDeletError = false
  }else{
    res.render('group/view-student', {
      title: GroupDetails.GroupName, group: true, groupHeader: true, GroupDetails, SessionName, studentEvents, studentLimitCount, EventLimit,
      FestDetails,   NewNotifi_Count 
  
    })

  }

});

router.get('/students/:SessionName/:ChestNo-:EventId/delete-event', verifyGroupLogin, (req, res) => {
  let SessionName = req.params.SessionName
  let GroupDetails = req.session.group
  let ChestNo = req.params.ChestNo
  let EventId = req.params.EventId
  festHelpers.deleteStudentEvent(GroupDetails.FestId, GroupDetails.GroupId, ChestNo, EventId, SessionName).then((respons) => {
    if(respons.eventDeletError){
      req.session.eventDeletError = "This event cannot be deleted"
      res.redirect('/group/students/' + SessionName + '/' + ChestNo + '/view')
    }else{
      res.redirect('/group/students/' + SessionName + '/' + ChestNo + '/view')
    }
  })
});

router.get('/students/:SessionName/:ChestNo/edit', verifyGroupLogin, async (req, res) => {
  let SessionName = req.params.SessionName
  let GroupDetails = req.session.group
  let ChestNo = req.params.ChestNo
  let NewNotifi_Count = await groupHelpers.getNewNotificaionCount(GroupDetails.FestId, GroupDetails.GroupId)

  let studentEvents = await festHelpers.getOneStudentEvents(GroupDetails.FestId, GroupDetails.GroupId, SessionName, ChestNo)
  res.render('group/edit-student', {
    title: GroupDetails.GroupName, group: true, groupHeader: true, GroupDetails, SessionName, studentEvents, NewNotifi_Count
  })
});

router.post('/students/:SessionName/:ChestNo/edit', verifyGroupLogin, (req, res) => {
  let SessionName = req.params.SessionName
  let GroupDetails = req.session.group
  let ChestNo = req.params.ChestNo
  groupHelpers.editStudentDetails(GroupDetails.FestId, GroupDetails.GroupId, ChestNo, req.body).then((response) => {
    if (response) {
      req.session.cicNOError = "This CIC number already used"
      res.redirect('/group/students/' + SessionName)
    } else {
      res.redirect('/group/students/' + SessionName)
    }
  })
});

router.get('/students/:SessionName/:ChestNo/delete', verifyGroupLogin, (req, res) => {
  var GroupDetails = req.session.group
  var SessionName = req.params.SessionName
  let ChestNo = req.params.ChestNo
  groupHelpers.removeStudent(GroupDetails.FestId, GroupDetails.GroupId, ChestNo, SessionName).then((response) => {

    if (response === undefined) {
      res.redirect('/group/students/' + SessionName)
    } else if (response.studentEventTrueError) {
      req.session.studentEventTrueError = "A few events have been added to this student, delete the event first"

      res.redirect('/group/students/' + SessionName)
    }
  })
})

// Events

router.get('/events', verifyGroupLogin, async (req, res) => {
  let GroupDetails = req.session.group
  var allItemCategorys = await festHelpers.getAllItemCategory(GroupDetails.FestId)
  var checkstudentCount = await groupHelpers.checkStudentsCountForEvent(GroupDetails.FestId, GroupDetails.GroupId)
  let NewNotifi_Count = await groupHelpers.getNewNotificaionCount(GroupDetails.FestId, GroupDetails.GroupId)

  res.render('group/events-session', {
    title: GroupDetails.GroupName, group: true, groupHeader: true, GroupDetails, NewNotifi_Count, allItemCategorys, checkstudentCount

  })
});

router.get('/events/:SessionName/:Category', verifyGroupLogin, async (req, res) => {
  let GroupDetails = req.session.group
  let SessionName = req.params.SessionName
  let Category = req.params.Category
  let GroupFullDetails = await groupHelpers.getGroupDetails(GroupDetails.GroupId, GroupDetails.FestId)
  let AllEvents = await groupHelpers.getAllEvents(GroupDetails.FestId, GroupDetails.GroupId, SessionName, Category)
  let EventActiveUndifined = GroupFullDetails.EventsTime === undefined
  let EventActiveNull = GroupFullDetails.EventsTime === null
  let NewNotifi_Count = await groupHelpers.getNewNotificaionCount(GroupDetails.FestId, GroupDetails.GroupId)


  if (req.session.EventAlreadyUsedError) {
    res.render('group/all-events', {
      title: GroupDetails.GroupName, group: true, groupHeader: true, GroupDetails, EventActiveUndifined,
      EventActiveNull, SessionName, Category, AllEvents, NewNotifi_Count, "EventAlreadyUsedError": req.session.EventAlreadyUsedError
    })
    req.session.EventAlreadyUsedError = false

  } else if (req.session.Success) {
    res.render('group/all-events', {
      title: GroupDetails.GroupName, group: true, groupHeader: true, GroupDetails, EventActiveUndifined,
      EventActiveNull, SessionName, Category, NewNotifi_Count, AllEvents, "Success": req.session.Success
    })
    req.session.Success = false

  } else if (req.session.StudentStageCountOver) {
    res.render('group/all-events', {
      title: GroupDetails.GroupName, group: true, groupHeader: true, GroupDetails, EventActiveUndifined,
      EventActiveNull, SessionName, Category, NewNotifi_Count, AllEvents, "StudentStageCountOver": req.session.StudentStageCountOver
    })
    req.session.StudentStageCountOver = false

  } else if (req.session.StudentTotalCountOver) {
    res.render('group/all-events', {
      title: GroupDetails.GroupName, group: true, groupHeader: true, GroupDetails, EventActiveUndifined,
      EventActiveNull, SessionName, Category, NewNotifi_Count, AllEvents, "StudentTotalCountOver": req.session.StudentTotalCountOver
    })
    req.session.StudentTotalCountOver = false

  } else if (req.session.EventLimitError) {
    res.render('group/all-events', {
      title: GroupDetails.GroupName, group: true, groupHeader: true, GroupDetails, EventActiveUndifined,
      EventActiveNull, SessionName, Category, NewNotifi_Count, AllEvents, "EventLimitError": req.session.EventLimitError
    })
    req.session.EventLimitError = false

  } else if (req.session.ChestNOError) {
    res.render('group/all-events', {
      title: GroupDetails.GroupName, group: true, groupHeader: true, GroupDetails, EventActiveUndifined,
      EventActiveNull, SessionName, Category, NewNotifi_Count, AllEvents, "ChestNOError": req.session.ChestNOError
    })
    req.session.ChestNOError = false
  } else if (req.session.TotalCountError) {
    res.render('group/all-events', {
      title: GroupDetails.GroupName, group: true, groupHeader: true, GroupDetails, EventActiveUndifined,
      EventActiveNull, SessionName, Category, NewNotifi_Count, AllEvents, "TotalCountError": req.session.TotalCountError
    })
    req.session.TotalCountError = false
  } else {
    res.render('group/all-events', {
      title: GroupDetails.GroupName, group: true, groupHeader: true, GroupDetails, EventActiveUndifined,
      EventActiveNull, SessionName, Category, NewNotifi_Count, AllEvents
    })
  }
});

router.get('/events/:SessionName/:Category/all-events', verifyGroupLogin, async (req, res) => {
  let GroupDetails = req.session.group
  let SessionName = req.params.SessionName
  let Category = req.params.Category
  var FestDetails = await festHelpers.getFestDetails(GroupDetails.FestId)
  let GroupFullDetails = await groupHelpers.getGroupDetails(GroupDetails.GroupId, GroupDetails.FestId)
  let AllEvents = await groupHelpers.getAllEvents(GroupDetails.FestId, GroupDetails.GroupId, SessionName, Category)
  let EventActiveUndifined = GroupFullDetails.EventsTime === undefined
  let EventActiveNull = GroupFullDetails.EventsTime === null
  let NewNotifi_Count = await groupHelpers.getNewNotificaionCount(GroupDetails.FestId, GroupDetails.GroupId)


  res.render('group/all-events-for-students', {
    title: GroupDetails.GroupName, group: true, groupHeader: true, GroupDetails, EventActiveUndifined,
    EventActiveNull, SessionName, Category, AllEvents, FestDetails, NewNotifi_Count
  })

});

router.get('/events/:SessionName/:Category/all-events/:EventId-:EventName/all-students', verifyGroupLogin, async (req, res) => {
  let GroupDetails = req.session.group
  let SessionName = req.params.SessionName
  let CategoryName = req.params.Category
  let EventId = req.params.EventId
  let EventName = req.params.EventName
  var FestDetails = await festHelpers.getFestDetails(GroupDetails.FestId)
  let EventStudents = await groupHelpers.getEventStudents(GroupDetails.FestId, GroupDetails.GroupId, CategoryName, EventId)
  let NewNotifi_Count = await groupHelpers.getNewNotificaionCount(GroupDetails.FestId, GroupDetails.GroupId)

 
  res.render('group/view-event-students', {
    title: GroupDetails.GroupName, group: true, groupHeader: true, GroupDetails, SessionName, CategoryName, EventId, EventName, EventStudents,
    FestDetails, NewNotifi_Count
  })
});

router.get('/events/:SessionName/:CategoryName/all-events/:EventId-:EventName/all-students/:ChestNo/delete-event', verifyGroupLogin, (req, res) => {
  let GroupDetails = req.session.group
  let SessionName = req.params.SessionName
  let CategoryName = req.params.CategoryName
  let EventId = req.params.EventId
  let EventName = req.params.EventName
  let ChestNo = req.params.ChestNo
  
  festHelpers.deleteStudentEvent(GroupDetails.FestId, GroupDetails.GroupId, ChestNo, EventId, SessionName).then(() => {
    res.redirect('/group/events/' + SessionName + '/' + CategoryName + '/all-events/' + EventId + '-' + EventName + '/all-students')
  });
})

router.get('/events/:SessionName/:Category/:EventId-:EventName', verifyGroupLogin, async (req, res) => {
  let GroupDetails = req.session.group
  let SessionName = req.params.SessionName
  let Category = req.params.Category
  let EventId = req.params.EventId
  let EventName = req.params.EventName
  let GroupFullDetails = await groupHelpers.getGroupDetails(GroupDetails.GroupId, GroupDetails.FestId)
  let SessionDetails = await groupHelpers.getSessionDetails(SessionName, GroupDetails)
  let SessionActivation = SessionDetails.SlNo === null || SessionDetails.SlNo === undefined
  let EventActiveNull = GroupFullDetails.EventsTime === null
  let NewNotifi_Count = await groupHelpers.getNewNotificaionCount(GroupDetails.FestId, GroupDetails.GroupId)

  res.render('group/add-event', {
    title: GroupDetails.GroupName, group: true, groupHeader: true, GroupDetails, SessionName,
    Category, EventId, EventName, EventActiveNull, SessionActivation, NewNotifi_Count
  })
});

router.post('/events/:SessionName/:Category/choose-event', verifyGroupLogin, (req, res) => {
  let SessionName = req.params.SessionName
  let Category = req.params.Category

  groupHelpers.addEvent(req.body).then((response) => {

    if (response.EventAlreadyUsedError) {
      req.session.EventAlreadyUsedError = "This event has already been used"
      res.redirect('/group/events/' + SessionName + '/' + Category)

    } else if (response.Success) {
      req.session.Success = "This event was successfully added"
      res.redirect('/group/events/' + SessionName + '/' + Category)

    } else if (response.StudentStageCountOver) {
      req.session.StudentStageCountOver = "This student can no longer participate in the category"
      res.redirect('/group/events/' + SessionName + '/' + Category)


    } else if (response.EventLimitError) {
      req.session.EventLimitError = "This event total limit complited"
      res.redirect('/group/events/' + SessionName + '/' + Category)

    } else if (response.ChestNOError) {
      req.session.ChestNOError = "Invalid chest no"
      res.redirect('/group/events/' + SessionName + '/' + Category)
    } else if (response.TotalCountError) {
      req.session.TotalCountError = "Admin panel not added this session event limit count"
      res.redirect('/group/events/' + SessionName + '/' + Category)

    }
  })
});

// Notifications

router.get('/notification', verifyGroupLogin, async (req, res) => {
  let GroupDetails = req.session.group
  let NewNotifi_Count = await groupHelpers.getNewNotificaionCount(GroupDetails.FestId, GroupDetails.GroupId)
  let FullNotifications = await groupHelpers.getFullNotifications(GroupDetails.FestId,GroupDetails.GroupId)
 
  res.render('group/Notification', { title: GroupDetails.GroupName, group: true, groupHeader: true, GroupDetails, NewNotifi_Count, FullNotifications })
});

router.post('/saw-notification',verifyGroupLogin,(req,res)=>{
  let GroupDetails = req.session.group
  groupHelpers.sawNotification(req.body,GroupDetails.FestId).then(()=>{
    res.json()
  })
});

router.post('/read-one-notification',verifyGroupLogin,(req,res)=>{
  let GroupDetails = req.session.group
  groupHelpers.readOneNotification(req.body,GroupDetails.FestId).then((response)=>{
    res.json(response)
  })
});
router.post('/clear-one-notification',verifyGroupLogin,(req,res)=>{
  let GroupDetails = req.session.group
  groupHelpers.clearOneNotification(req.body,GroupDetails.FestId).then((response)=>{
    res.json(response)
  })
});
router.post('/read-full-notification',verifyGroupLogin,(req,res)=>{
  let GroupDetails = req.session.group
  groupHelpers.readFullNotification(req.body,GroupDetails.FestId).then((response)=>{
    res.json(response)
  })
});

router.get('/notification/:MessageId/view',verifyGroupLogin,async(req,res)=>{
  let GroupDetails = req.session.group
  var FestDetails = await festHelpers.getFestDetails(GroupDetails.FestId)
  let MessageId = req.params.MessageId
  let NewNotifi_Count = await groupHelpers.getNewNotificaionCount(GroupDetails.FestId, GroupDetails.GroupId)
  let Message = await groupHelpers.getOneMessage(GroupDetails.FestId,GroupDetails.GroupId,MessageId)
  res.render('group/view-notification',{
    title: GroupDetails.GroupName, group: true, groupHeader: true, GroupDetails, NewNotifi_Count ,FestDetails,Message
  })
})


//........ Other
router.get('/other', verifyGroupLogin, async(req, res) => {
  let GroupDetails = req.session.group
  let NewNotifi_Count = await groupHelpers.getNewNotificaionCount(GroupDetails.FestId, GroupDetails.GroupId)

  res.render('group/other', { title: GroupDetails.GroupName, group: true, groupHeader: true, GroupDetails, NewNotifi_Count })
});
// other . change password
router.get('/settings/change-password', verifyGroupLogin, async(req, res) => {
  let GroupDetails = req.session.group
  let NewNotifi_Count = await groupHelpers.getNewNotificaionCount(GroupDetails.FestId, GroupDetails.GroupId)


  if (req.session.passwordChangeSuccess) {
    res.render('group/change-password', { title: GroupDetails.GroupName, group: true, groupHeader: true, NewNotifi_Count, GroupDetails, "passwordChangeSuccess": req.session.passwordChangeSuccess })
    req.session.passwordChangeSuccess = false
  } else if (req.session.passwordChangeError) {
    res.render('group/change-password', { title: GroupDetails.GroupName, group: true, groupHeader: true, NewNotifi_Count, GroupDetails, "passwordChangeError": req.session.passwordChangeError })
    req.session.passwordChangeError = false
  } else {
    res.render('group/change-password', { title: GroupDetails.GroupName, group: true, groupHeader: true, NewNotifi_Count, GroupDetails })
  }
});

router.post('/settings/change-password', verifyGroupLogin, (req, res) => {
  groupHelpers.changePassword(req.body).then((response) => {
    if (response) {
      req.session.passwordChangeSuccess = "Password Successfuly changed"
      res.redirect('/group/settings/change-password')
    } else {
      req.session.passwordChangeError = "Invalid Current password"
      res.redirect('/group/settings/change-password')
    }
  })
});






module.exports = router;
