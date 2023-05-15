const express = require('express');
const router = express.Router();
const { verifyGroupLogin } = require('../middleware/verify-middleware')



const { getHomePage, getNewNotifiCount } = require('../controllers/group/home-controller')
/* GET home page. */
router.get('/', verifyGroupLogin, getHomePage);
router.post('/get-new-notification-count', verifyGroupLogin, getNewNotifiCount)

const { getLogin, postLogin, getLogOut } = require('../controllers/group/auth-controller')

router.get('/login', getLogin);
router.post('/login', postLogin);
router.get('/logOut', verifyGroupLogin, getLogOut);


// ......... Students
const {
  getStudentsMainPage, getStudentsListPage, getCreateStudent, postCreateStudent, getStudentViewpage, deleteItem,
  getStudentEditPage, postStudentEditPage, deleteStudent, getStudentWithOutItem
} = require('../controllers/group/students-controller')

router.get('/students', verifyGroupLogin, getStudentsMainPage);
router.get('/students/students-without-item', verifyGroupLogin, getStudentWithOutItem)
router.get('/students/:Category', verifyGroupLogin, getStudentsListPage);
router.get('/students/:Category/add-students', verifyGroupLogin, getCreateStudent);
router.post('/students/:Category/add-students', verifyGroupLogin, postCreateStudent);
router.get('/students/:Category/:ChestNo/view', verifyGroupLogin, getStudentViewpage);
router.get('/students/:Category/:ChestNo-:ItemId/delete-event', verifyGroupLogin, deleteItem);
router.get('/students/:Category/:ChestNo/edit', verifyGroupLogin, getStudentEditPage);
router.post('/students/:Category/:ChestNo/edit', verifyGroupLogin, postStudentEditPage);
router.get('/students/:Category/:ChestNo/delete', verifyGroupLogin, deleteStudent)

// Events
const {
  getItemMainPage, getItemListPage, getItemStudents, getChooseItemPage, postChooseItemPage, deleteStudentItem
} = require('../controllers/group/item-controller')


router.get('/items', verifyGroupLogin, getItemMainPage);
router.get('/items/:Category/:SubCategory', verifyGroupLogin, getItemListPage);
router.get('/items/:Category/:SubCategory/all-items/:ItemId-:ItemName/all-students', verifyGroupLogin, getItemStudents);
router.get('/items/:Category/:SubCategory/all-items/:ItemId-:ItemName/choose-item', verifyGroupLogin, getChooseItemPage);
router.post('/items/:Category/:SubCategory/choose-item', verifyGroupLogin, postChooseItemPage);
router.get('/items/:Category/:SubCategory/all-items/:ItemId-:ItemName/all-students/:ChestNo/delete-item',
  verifyGroupLogin, deleteStudentItem)


// Notifications
const { getNotifiMainPage, showNotifi, readOneNotifi, deleteOneNotifi, readAllNotifi, viewNotifi } = require('../controllers/group/notification-controller');

router.get('/notification', verifyGroupLogin, getNotifiMainPage);
router.post('/notification/saw-notification', verifyGroupLogin, showNotifi);
router.post('/notification/read-one-notification', verifyGroupLogin, readOneNotifi);
router.post('/notification/clear-one-notification', verifyGroupLogin, deleteOneNotifi);
router.post('/notification/read-full-notification', verifyGroupLogin, readAllNotifi);
router.get('/notification/:MessageId/view', verifyGroupLogin, viewNotifi)


//........ Other
const { getMainPage, getChangePasswordPage, postChangePassword, fetchData } = require('../controllers/group/other-controller')

router.get('/other', verifyGroupLogin, getMainPage);

// other ---- change password
router.get('/change-password', verifyGroupLogin, getChangePasswordPage);
router.post('/change-password', verifyGroupLogin, postChangePassword);

// other ---- refresh
router.post('/fetch-data', verifyGroupLogin, fetchData);


module.exports = router;
