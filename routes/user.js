const express = require('express');
const router = express.Router();
const userHelpers = require('../helpers/user-helpers');
const eventHelpers = require('../helpers/event-helpers');
const groupHelpers = require('../helpers/group-helpers');
const markHelpers = require('../helpers/mark-helpers')
const resultHelpers = require('../helpers/result-helpers')
const { verifyActiveEvent } = require('../middleware/verify-middleware')


/* GET home page. */
const { getHomePage } = require('../controllers/user/user-controller')
router.get('/', getHomePage);

// Result - Home
const { getResultHomePage, getCategoryStatus, getItemBaiseResultPage, searchItemBaise, getItemBaiseSubPage,
  getItemBaiseIndividualStudents, getItemBaiseGroupStudents, getStudentBaiseResultPage, searchStudentsBaise,
  getStudentBaiseSubPage, getStudentBaiseList, getStudentBaiseItems, getGrandWinnerStudents
 } = require('../controllers/user/result-controller')

  router.get('/e/:EventId', verifyActiveEvent, getResultHomePage);
router.get('/e/:EventId/catgory-baise-result-published-status', verifyActiveEvent, getCategoryStatus);

// Result - Item Baise
router.get('/e/:EventId/item-baise', verifyActiveEvent, getItemBaiseResultPage);
router.post('/e/search-event-result', searchItemBaise);
router.get('/e/:EventId/item-baise/:Category/:SubCategory', verifyActiveEvent, getItemBaiseSubPage);
router.get('/e/:EventId/item-baise/:Category/:SubCategory/Individual/:ItemId-:ItemName',
  verifyActiveEvent, getItemBaiseIndividualStudents);
router.get('/e/:EventId/item-baise/:Category/:SubCategory/Group/:ItemId-:ItemName', verifyActiveEvent, getItemBaiseGroupStudents);

// Result - Student Baise
router.get('/e/:EventId/student-baise', verifyActiveEvent, getStudentBaiseResultPage);
router.post('/e/search-students', searchStudentsBaise);
router.get('/e/:EventId/student-baise/:GroupId', verifyActiveEvent, getStudentBaiseSubPage);
router.get('/e/:EventId/student-baise/:GroupId/:Category/Students', verifyActiveEvent, getStudentBaiseList);
router.get('/e/:EventId/student-baise/:GroupId/:Category/Students/:ChestNo', getStudentBaiseItems);

// Grand Winner
router.get('/e/:EventId/grand-winner-student', verifyActiveEvent, getGrandWinnerStudents);



module.exports = router;
