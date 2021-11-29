var express = require('express');
var router = express.Router();
const userHelpers = require('../helpers/user-helpers');
var festHelpers = require('../helpers/fest-helpers');
const groupHelpers = require('../helpers/group-helpers');
const markHelpers = require('../helpers/mark-helpers')
const resultHelpers = require('../helpers/result-helpers')


const verifyActiveFest = async (req, res, next) => {
  let activeFest = await userHelpers.activeFest()
  let activeResult = await userHelpers.activeResult()
  if (activeFest) {
    if (activeResult) {
      if (req.session.user.FestId == activeFest.FestId) {
        next()
      } else {
        res.redirect('/')
      }
    } else {
      res.redirect('/')
    }
  } else {
    res.redirect('/')
  }

};
/* GET home page. */
router.get('/', async function (req, res, next) {
  let activeFest = await userHelpers.activeFest()
  let activeResult = await userHelpers.activeResult()
  req.session.user = activeFest
  let userDetails = req.session.user


  if (activeFest) {
    if (req.session.group == null) {
    } else {
      req.session.user.GroupId = req.session.group.GroupId
    }

    if (activeResult) {

      res.redirect("/" + req.session.user.FestId + '/result')
    } else {
      let activeFestGroups = await festHelpers.getAllGroups(activeFest.FestId)
      res.render('user/home', { title: userDetails.FestName, activeFest, activeFestGroups, userDetails, footer: true });
    }
  } else {
    res.render('user/home', { title: "NSA Online", userDetails, footer: true });
  }
});

router.get('/:FestId/result', verifyActiveFest, async (req, res) => {
  let userDetails = req.session.user
  let TotalEventsCount = await resultHelpers.TotalEventCount(userDetails.FestId)
  let PublisedResultCount = await resultHelpers.PublisedResultCount(userDetails.FestId)
  let PendingResultCount = TotalEventsCount - PublisedResultCount
  let PercentageTotalResultPublised = (PublisedResultCount / TotalEventsCount) * 100

  // cut after dot
  var a = PercentageTotalResultPublised.toString()
  if (a === "NaN") {
    a = "0"
  }
  var num = a.indexOf(".");
  if (num == -1) {
    PercentageTotalResultPublised = a
  } else {
    PercentageTotalResultPublised = a.slice(0, num)
  }
  let totalGroupsMark = await resultHelpers.totalGroupsMark(userDetails.FestId)
  let sessionBaiseMarkList = await resultHelpers.sessionBaiseMarkList(userDetails.FestId)

  res.render('user/result-home', {
    title: userDetails.FestName, userDetails, TotalEventsCount, PublisedResultCount,
    PendingResultCount, PercentageTotalResultPublised, totalGroupsMark, sessionBaiseMarkList, footer: true
  });
});

router.get('/:FestId/result/result-status', verifyActiveFest, (req, res) => {
  let userDetails = req.session.user
  resultHelpers.resultFullStatus(userDetails.FestId).then((result) => {
    res.render('user/result-status', { title: userDetails.FestName, userDetails, result })
  })
});


router.get('/:FestId/result/event-baise', verifyActiveFest, async (req, res) => {
  let userDetails = req.session.user
  var allPointCategory = await festHelpers.getPointCategory(userDetails.FestId)
  var categoryNull = allPointCategory == true
  var allItemCategorys = await festHelpers.getAllItemCategory(userDetails.FestId)

  res.render('user/event-baise', {
    title: userDetails.FestName, userDetails, allItemCategorys, categoryNull
  })
});


router.post('/search-event-result', verifyActiveFest, (req, res) => {
  resultHelpers.searchEvent(req.body).then((searchResult) => {
    res.json(searchResult)
  })
});

router.get('/:FestId/result/event-baise/:Session/:Category', verifyActiveFest, async (req, res) => {
  let userDetails = req.session.user
  var Category = req.params.Category
  var Session = req.params.Session
  userDetails.Session = Session
  userDetails.Category = Category
  var allEvents = await festHelpers.getAllEvents(userDetails)

  res.render('user/event-sessions', {
    title: userDetails.FestName, userDetails, Category, Session, allEvents
  })
});


router.get('/:FestId/result/event-baise/:Session/:Category/:EventId-:EventName', verifyActiveFest, async (req, res) => {
  let userDetails = req.session.user
  var Category = req.params.Category
  var Session = req.params.Session
  var EventId = req.params.EventId
  var EventName = req.params.EventName
 
  let EventStudents = await resultHelpers.getEventBaiseStudentsMark(userDetails.FestId, Session, Category, EventId)
  res.render('user/event-baise-student', {
    title: userDetails.FestName, userDetails, Category, Session, EventId, EventName, EventStudents
  })
});

router.get('/:FestId/result/student-baise', verifyActiveFest, async (req, res) => {
  var userDetails = req.session.user
  var AllGroups = await festHelpers.getAllGroups(userDetails.FestId)

  res.render('user/student-baise', { title: userDetails.FestName, userDetails, AllGroups })
});

// router.post('/search-student-result', verifyActiveFest, (req, res) => {
//   resultHelpers.searchStudent(req.body).then((searchResult) => {
//     res.json(searchResult)
//   })
// });


router.get('/:FestId/result/student-baise/:GroupId', verifyActiveFest, async (req, res) => {
  var userDetails = req.session.user
  var GroupId = req.params.GroupId
  let GroupDetails = await groupHelpers.getGroupDetails(GroupId, userDetails.FestId)
  let result = await groupHelpers.getAllCategorys(GroupDetails)
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
  res.render('user/student-baise-category', {
    title: userDetails.FestName, userDetails, GroupDetails, AllSessions,
  })
});


router.get('/:FestId/result/student-baise/:GroupId/:SessionName/Students', verifyActiveFest, async (req, res) => {
  var userDetails = req.session.user
  var GroupId = req.params.GroupId
  let GroupDetails = await groupHelpers.getGroupDetails(GroupId, userDetails.FestId)
  let SessionName = req.params.SessionName
  let AllStudents = await groupHelpers.getAllStudents(SessionName, GroupDetails)

  res.render('user/student-baise-students', {
    title: userDetails.FestName, userDetails, GroupDetails, AllStudents, SessionName,
  })
});

router.get('/:FestId/result/student-baise/:GroupId/:SessionName/Students/:ChestNo', verifyActiveFest, async (req, res) => {
  var userDetails = req.session.user
  var GroupId = req.params.GroupId
  let SessionName = req.params.SessionName
  let ChestNo = req.params.ChestNo
  let GroupDetails = await groupHelpers.getGroupDetails(GroupId, userDetails.FestId)
  let studentEvents = await festHelpers.getOneStudentEvents(userDetails.FestId, GroupId, SessionName, ChestNo)

  res.render('user/student-baise-events', {
    title: userDetails.FestName, SessionName, userDetails, studentEvents, GroupId, GroupDetails
  })
});


router.get('/:FestId/result/other-mark', verifyActiveFest, (req, res) => {
  var userDetails = req.session.user
  res.render('user/other-mark-home', { title: userDetails.FestName, userDetails, })
});

router.get('/:FestId/result/other-mark/group/view-result', verifyActiveFest, (req, res) => {
  var userDetails = req.session.user
  var Group = true
  resultHelpers.getGroupOtherMarkResult(userDetails.FestId).then((result) => {

    res.render('user/other-mark-result', {
      title: userDetails.FestName, userDetails, result, Group
    })
  })

});

router.get('/:FestId/result/other-mark/session/view-result', verifyActiveFest, (req, res) => {
  var userDetails = req.session.user
  var Session = true
  resultHelpers.getSessionOtherMarkResult(userDetails.FestId).then((result) => {

    res.render('user/other-mark-result', {
      title: userDetails.FestName, userDetails, result, Session
    })
  })

});
router.get('/:FestId/result/other-mark/student/view-result', verifyActiveFest, (req, res) => {
  var userDetails = req.session.user
  var Student = true
  resultHelpers.getStudentOtherMarkResult(userDetails.FestId).then((result) => {

    res.render('user/other-mark-result', {
      title: userDetails.FestName, userDetails, result, Student
    })
  })

});

router.post('/search-other-mark-result', verifyActiveFest, (req, res) => {
  resultHelpers.searchOtherMark(req.body).then((searchResult) => {
  
    res.json(searchResult)
  })
});


router.get('/:FestId/result/toppers', verifyActiveFest, (req, res) => {
  var userDetails = req.session.user
  res.render('user/toppers-home', { title: userDetails.FestName, userDetails, })
});


router.get('/:FestId/result/toppers/group/view-result', verifyActiveFest, (req, res) => {
  var userDetails = req.session.user
  var Group = true
  resultHelpers.getGroupToppersResult(userDetails.FestId).then((result) => {
    res.render('user/toppers-result', {
      title: userDetails.FestName, userDetails, result, Group
    })
  })

});

router.get('/:FestId/result/toppers/session/view-result', verifyActiveFest, (req, res) => {
  var userDetails = req.session.user
  var Session = true
  resultHelpers.getSessionToppersResult(userDetails.FestId).then((result) => {

    res.render('user/toppers-result', {
      title: userDetails.FestName, userDetails, result, Session
    })
  })

});

router.get('/:FestId/result/toppers/student/view-result', verifyActiveFest, (req, res) => {
  var userDetails = req.session.user
  var Student = true
  resultHelpers.getStudentToppersResult(userDetails.FestId).then((result) => {

    res.render('user/toppers-result', {
      title: userDetails.FestName, userDetails, result, Student
    })
  })

});

router.post('/search-toppers-view', verifyActiveFest, (req, res) => {
  resultHelpers.searchToppers(req.body).then((searchResult) => {

    res.json(searchResult)
  })
});


router.get('/:FestId/result/grand-winner-group', verifyActiveFest, async (req, res) => {
  let userDetails = req.session.fest
  let sessionBaiseMarkList = await resultHelpers.sessionBaiseMarkList(userDetails.FestId)
  let totalGroupsMark = await resultHelpers.totalGroupsMark(userDetails.FestId)

  await resultHelpers.GrandWinnerGroup(userDetails.FestId, sessionBaiseMarkList, totalGroupsMark).then((result) => {

    res.render('user/grand-winner-group', { title: userDetails.FestName, userDetails, result })
  })
});

router.get('/:FestId/result/grand-winner-student', verifyActiveFest, async (req, res) => {
  let userDetails = req.session.fest
  let sessionBaiseMarkList = await resultHelpers.sessionBaiseMarkList(userDetails.FestId)
  await resultHelpers.GrandWinnerStudent(userDetails.FestId, sessionBaiseMarkList).then((result) => {
    res.render('user/grand-winner-student', { title: userDetails.FestName, userDetails, result })
  })
});

router.post('/search-toppers-view', verifyActiveFest, (req, res) => {
  resultHelpers.searchToppers(req.body).then((searchResult) => {

    res.json(searchResult)
  })
});



router.post('/search-student-events', verifyActiveFest, (req, res) => {
 
  userHelpers.searchStudentEvent(req.body).then((searchResult) => {
    res.json(searchResult)

  })
});
router.post('/search-student', (req, res) => {

  userHelpers.searchStudentEvent(req.body).then((searchResult) => {
    res.json(searchResult)

  })
});

router.get('/:FestId/result/student-baise/:GroupId/:SessionName/Students/:ChestNo/events', async (req, res) => {
  var userDetails = req.session.user
  var GroupId = req.params.GroupId
  let SessionName = req.params.SessionName
  let ChestNo = req.params.ChestNo
  let GroupDetails = await groupHelpers.getGroupDetails(GroupId, userDetails.FestId)
  let studentEvents = await festHelpers.getOneStudentEvents(userDetails.FestId, GroupId, SessionName, ChestNo)

  res.render('user/students-events', {
    title: userDetails.FestName, SessionName, userDetails, studentEvents, GroupId, GroupDetails
  })
});



module.exports = router;
