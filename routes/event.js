const express = require('express');
const router = express.Router();
const { verifyEventLogin, verifyAdminLogin } = require('../middleware/verify-middleware')

const { getPageOne, postPageOne, postPageTwo, postPageThree, postPageFour, postEventLogin, getEventLogin, getEventLogOut,
  getForgotPasswordPage, postForgotPassword, getForgotPasswordOtpPage, postForgotPasswordOtpPage, getForgotpasswordSetPage,
  getDashboard
} = require('../controllers/admin/event-controller')

// Create Event
router.get('/create-page1', verifyAdminLogin, getPageOne);
router.post('/create-page2', verifyAdminLogin, postPageOne);
router.post('/create-page3', verifyAdminLogin, postPageTwo);
router.post('/create-page4', verifyAdminLogin, postPageThree);
router.post('/create-page5', verifyAdminLogin, postPageFour)

// Authentication
router.get('/login', getEventLogin)
router.post('/login', postEventLogin);
router.get('/:EventId/logout', verifyEventLogin, getEventLogOut);
router.get('/forgot-password', getForgotPasswordPage)
router.post('/forgot-password', postForgotPassword);
router.get('/forgot-password/otp', getForgotPasswordOtpPage)
router.post('/forgot-password/otp/:mobile', postForgotPasswordOtpPage)
router.get('/forgot-password/set-password', getForgotpasswordSetPage)


//   Dashboard
router.get('/:EventId/dashboard', verifyEventLogin, getDashboard);


const {
  getEventItemPage, getItemListPage, getAddItemPage, postAddItem, getEditItem, postEditItem, deleteItem, getItemAllStudents,
  getAddStudentToItemPage, postAddStudentToItem, deleteStudentFromItem,
} = require('../controllers/admin/items-controller')
// Event Items
router.get('/:EventId/event-items', verifyEventLogin, getEventItemPage);
router.get('/:EventId/event-items/:Category-:SubCategory', verifyEventLogin, getItemListPage);
router.get('/:EventId/event-items/:Category-:SubCategory/add-event', verifyEventLogin, getAddItemPage)
router.post('/:EventId/event-items/:Category-:SubCategory/add-event', verifyEventLogin, postAddItem);
router.get('/:EventId/event-items/:Category-:SubCategory/:ItemId/edit-item', verifyEventLogin, getEditItem);
router.post('/:EventId/event-items/:Category-:SubCategory/edit-item', verifyEventLogin, postEditItem);
router.get('/:EventId/event-items/:Category-:SubCategory/:ItemId/delete-item', verifyEventLogin, deleteItem);
router.get('/:EventId/event-items/:Category-:SubCategory/:ItemId-:ItemName/all-students', verifyEventLogin, getItemAllStudents);
router.get('/:EventId/event-items/:Category-:SubCategory/:ItemId-:ItemName/add-students', verifyEventLogin, getAddStudentToItemPage);
router.post('/:EventId/event-items/:Category-:SubCategory/:ItemId-:ItemName/add-students', verifyEventLogin, postAddStudentToItem);
router.get('/:EventId/event-items/:Category-:SubCategory/:ItemId-:ItemName/:GroupId/:ChestNo/delete-event', verifyEventLogin, deleteStudentFromItem);


// Group
const { getAddStudentPage, postAddStudent, deleteStudent, getStudentsEventPage, deleteItemFormStudent,
  getGroupsList, postActiveGroup, getGroupViewPage, getGroupStudentsList,
} = require('../controllers/admin/group-controller')

router.get('/:EventId/groups', verifyEventLogin, getGroupsList);
router.post('/:EventId/groups/:GroupName/confierm', verifyEventLogin, postActiveGroup);
router.get('/:EventId/groups/:GroupId/view', verifyEventLogin, getGroupViewPage);
router.get('/:EventId/groups/:GroupId/:Category/students', verifyEventLogin, getGroupStudentsList);
router.get('/:EventId/groups/:GroupId/:Category/students/add-student', verifyEventLogin, getAddStudentPage);
router.post('/:EventId/groups/:GroupId/:Category/students/add-student', verifyEventLogin, postAddStudent);
router.get('/:EventId/groups/:GroupId/:Category/students/:ChestNo/delete', verifyEventLogin, deleteStudent)
router.get('/:EventId/groups/:GroupId/:Category/students/:ChestNo/view', verifyEventLogin, getStudentsEventPage);
router.get('/:EventId/groups/:GroupId/:Category/students/:ChestNo-:ItemId/delete-event', verifyEventLogin, deleteItemFormStudent)

const {
  getPointsPage, getAddPoints, postAddPoints, deletePoint,
} = require('../controllers/admin/point-controller')

// Point Category
router.get('/:EventId/points', verifyEventLogin, getPointsPage)
router.get('/:EventId/points/add-table', verifyEventLogin, getAddPoints)
router.post('/:EventId/points/add-table', verifyEventLogin, postAddPoints);
router.get('/:EventId/points/delete/:categoryName', verifyEventLogin, deletePoint);

const { getControllPanelPage, launchEvent, publishResult, changeMarkStatus, changeAddStudentStatus, changeEditStudentStatus,
  changeChooseItemStatus } = require('../controllers/admin/panel-controller')
// Control Panel
router.get('/:EventId/control-panel', verifyEventLogin, getControllPanelPage);
router.post('/launch-event', verifyEventLogin, launchEvent);
router.post('/result-publish', verifyEventLogin, publishResult);
router.post('/change-mark-status', verifyEventLogin, changeMarkStatus)
router.post('/OnStudents', verifyEventLogin, changeAddStudentStatus);
router.post('/ShowEditOption', verifyEventLogin, changeEditStudentStatus);
router.post('/OnEvents', verifyEventLogin, changeChooseItemStatus);


const {
  getSettingsPage, getGroupCategoryLimit, postGroupCategoryLimit, uploadEventImage, editEventDetails, getEventSettingsPage,
  changeEventPassword, getEditGroupDetails, postEditGroupDetails, deleteEvent, getStudentsWithOutPrograme, getUploadFilePage,
  postUploadFile, deleteUploadFile, getNotificationSendPage, postNotificationSend, getAllNotifications, getGroupBaiseNotifications,
  viewOneNotification, deleteMessageFromAll, deleteMessageFromOne

} = require('../controllers/admin/more-controller')
// More
router.get('/:EventId/more', verifyEventLogin, getSettingsPage);

// More - Group Category
router.get('/:EventId/group-category', verifyEventLogin, getGroupCategoryLimit);
router.post('/:EventId/group-category/edit-limit', verifyEventLogin, postGroupCategoryLimit)

// More - Event
router.get('/:EventId/event-settings', verifyEventLogin, getEventSettingsPage);
router.post('/:EventId/event-settings/imageUpload', verifyEventLogin, uploadEventImage);
router.post('/:EventId/event-settings/edit-details', verifyEventLogin, editEventDetails);
router.post('/:EventId/event-settings/change-password', verifyEventLogin, changeEventPassword);
router.get('/:EventId/event-settings/edit-group/:GroupId', verifyEventLogin, getEditGroupDetails);
router.post('/:EventId/event-settings/edit-group', verifyEventLogin, postEditGroupDetails);
router.get('/:EventId/event-settings/delete-event', verifyEventLogin, deleteEvent);

// More - Students WithOut Event
router.get('/:EventId/student/student-without-items', verifyEventLogin, getStudentsWithOutPrograme);

// More - Upload File
router.get('/:EventId/upload-files', verifyEventLogin, getUploadFilePage);
router.post('/:EventId/upload-files/add', verifyEventLogin, postUploadFile);
router.get('/:EventId/upload-files/:FileId-:Title/delete', verifyEventLogin, deleteUploadFile);

// More - Notifications
router.get('/:EventId/notifications/send', verifyEventLogin, getNotificationSendPage);
router.post('/:EventId/notifications/send', verifyEventLogin, postNotificationSend);
router.get('/:EventId/notifications', verifyEventLogin, getAllNotifications);
router.get('/:EventId/notifications/:GroupId', verifyEventLogin, getGroupBaiseNotifications)
router.get('/:EventId/notifications/:MessageId/view', verifyEventLogin, viewOneNotification);
router.get('/:EventId/notifications/:GroupId/:MessageId/delete-all', verifyEventLogin, deleteMessageFromAll);
router.get('/:EventId/notifications/:GroupId/:MessageId/delete-one', verifyEventLogin, deleteMessageFromOne)

// Upload Mark
const { getMainPage, activeUploadMark, getItemListOfMark, changeResultStatus, getAddIndividualMarkPage,
  postAddIndividualMarkPage, getAddGroupMarkPage, postAddGroupMarkPage } = require('../controllers/admin/mark-controller')

router.get('/:EventId/mark', verifyEventLogin, getMainPage);
router.get('/:EventId/mark/active-upload', verifyEventLogin, activeUploadMark)
router.get('/:EventId/mark/:Category-:SubCategory', verifyEventLogin, getItemListOfMark);
router.post('/mark/change-result-status', verifyEventLogin, changeResultStatus)
router.get('/:EventId/mark/:Category-:SubCategory/Individual/:ItemId-:ItemName/add-mark', verifyEventLogin, getAddIndividualMarkPage);
router.post('/:EventId/mark/:Category-:SubCategory/Individual/:ItemId-:ItemName/add-mark', verifyEventLogin, postAddIndividualMarkPage)
router.get('/:EventId/mark/:Category-:SubCategory/Group/:ItemId-:ItemName/add-mark', verifyEventLogin, getAddGroupMarkPage);
router.post('/:EventId/mark/:Category-:SubCategory/Group/:ItemId-:ItemName/add-mark', verifyEventLogin, postAddGroupMarkPage);


// Result
const { getResultHomePage, getCategoryBaisePublishedStatus, getItemBaiseResultPage, searchItemBaise, getItemBaiseSubPage,
  getItemBaiseIndividualStudents, getItemBaiseGroupStudents, getStudentBaiseResultPage, searchStudentsBaise,
  getStudentBaiseSubPage, getStudentBaiseList, getStudentBaiseItems, getGrandWinnerStudents } = require('../controllers/admin/result-controller');

router.get('/:EventId/result', verifyEventLogin, getResultHomePage);
router.get('/:EventId/result/catgory-baise-result-published-status', verifyEventLogin, getCategoryBaisePublishedStatus);
router.get('/:EventId/result/item-baise', verifyEventLogin, getItemBaiseResultPage);
router.post('/result/search-item-result', verifyEventLogin, searchItemBaise);
router.get('/:EventId/result/item-baise/:Category/:SubCategory', verifyEventLogin, getItemBaiseSubPage);
router.get('/:EventId/result/item-baise/:Category/:SubCategory/Individual/:ItemId-:ItemName', verifyEventLogin, getItemBaiseIndividualStudents);
router.get('/:EventId/result/item-baise/:Category/:SubCategory/Group/:ItemId-:ItemName', verifyEventLogin, getItemBaiseGroupStudents);
router.get('/:EventId/result/student-baise', verifyEventLogin, getStudentBaiseResultPage);
router.post('/result/search-student-result', verifyEventLogin, searchStudentsBaise);
router.get('/:EventId/result/student-baise/:GroupId', verifyEventLogin, getStudentBaiseSubPage);
router.get('/:EventId/result/student-baise/:GroupId/:Category/students', verifyEventLogin, getStudentBaiseList);
router.get('/:EventId/result/student-baise/:GroupId/:Category/students/:ChestNo', verifyEventLogin, getStudentBaiseItems);
router.get('/:EventId/result/grand-winner-student', verifyEventLogin, getGrandWinnerStudents);






module.exports = router;