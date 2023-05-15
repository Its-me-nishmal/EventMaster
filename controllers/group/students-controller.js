const groupHelpers = require('../../helpers/group-helpers')
const eventHelpers = require('../../helpers/event-helpers');
const itemHelpers = require('../../helpers/item-helpers');
const studentHelpers = require('../../helpers/student-helpers');

const getStudentsMainPage = async (req, res) => { 
    const Group = req.session.group
    let NullItemStudents = await studentHelpers.GroupBaiseStudentWithOutItems(Group.EventId, Group.GroupId)
    NullItemStudents = NullItemStudents.length
    groupHelpers.getGroupDetails(Group.GroupId, Group.EventId).then((response) => {
        let category = response.Category
        res.render('group/students/main-page', {
            title: Group.GroupName, group: true, groupHeader: true, Group, category,
            NullItemStudents
        })
    })
}

const getStudentsListPage = async (req, res) => { 

    const Category = req.params.Category
    const Group = req.session.group
    const AllStudents = await studentHelpers.getAllStudentsInGroup(Group.EventId, Group.GroupId, Category)
    const GroupDetails = await groupHelpers.getGroupDetails(Group.GroupId, Group.EventId)
    const eventDetails = await eventHelpers.getEventDetails(Group.EventId)
    if (req.session.Success) {
        res.render('group/students/students-list', {
            title: Group.GroupName, group: true, groupHeader: true, AllStudents, Group, GroupDetails, Category,
            "Success": req.session.Success, eventDetails
        })
        req.session.Success = false
    } else if (req.session.Error) {
        res.render('group/students/students-list', {
            title: Group.GroupName, group: true, groupHeader: true, AllStudents, Group, GroupDetails, Category,
            "Error": req.session.Error, eventDetails
        })
        req.session.Error = false
    } else {
        res.render('group/students/students-list', {
            title: Group.GroupName, group: true, groupHeader: true, AllStudents, Group, GroupDetails, Category,
            eventDetails
        })

    }
}

const getCreateStudent = async (req, res) => { 
    let Category = req.params.Category
    let Group = req.session.group
    let GroupDetails = await groupHelpers.getGroupDetails(Group.GroupId, Group.EventId)

    if (req.session.Error) {
        res.render('group/students/add-students', {
            title: Group.GroupName, group: true, groupHeader: true, Group, GroupDetails,
            Category, "Error": req.session.Error
        })
        req.session.Error = false
    } else if (req.session.Success) {
        res.render('group/students/add-students', {
            title: Group.GroupName, group: true, groupHeader: true, Group, GroupDetails,
            Category, "Success": req.session.Success
        })
        req.session.Success = false
    } else {
        res.render('group/students/add-students', {
            title: Group.GroupName, group: true, groupHeader: true, Group, GroupDetails,
            Category
        })
    }
}

const postCreateStudent = (req, res) => { 
    let Category = req.params.Category
    let Group = req.session.group
    studentHelpers.createStudent(Group.EventId, Group.GroupId, Category, req.body).then((response) => {

        if (response) {
            req.session.Error = "This CIC number already used"
            res.redirect('/group/students/' + Category + '/add-students')
        } else {
            req.session.Success = "New Student Added"
            res.redirect('/group/students/' + Category + '/add-students')
        }
    })
}

const getStudentViewpage = async (req, res) => { 
    let Category = req.params.Category
    let Group = req.session.group
    let ChestNo = req.params.ChestNo
    const Event = await eventHelpers.getEventDetails(Group.EventId)
    let Student = await studentHelpers.getOneStudentItems(Group.EventId, ChestNo)
    let EventLimit = await itemHelpers.findOneItemInCategory(Group.EventId, Category)

    res.render('group/students/view-student', {
        title: Group.GroupName, group: true, groupHeader: true, Group, Category, Student, EventLimit, Event
    })
}

const deleteItem = (req, res) => { 
    let Category = req.params.Category
    let Group = req.session.group
    let ChestNo = req.params.ChestNo
    let ItemId = req.params.ItemId
    studentHelpers.deleteStudentItem(Group.EventId, ChestNo, ItemId).then(() => {
        res.redirect('/group/students/' + Category + '/' + ChestNo + '/view')
    })
}

const getStudentEditPage = async (req, res) => { 
    let Category = req.params.Category
    let Group = req.session.group
    let ChestNo = req.params.ChestNo
    let student = await studentHelpers.getOneStudentWithOutItem(Group.EventId, ChestNo)

    if (req.session.Error) {
        res.render('group/students/edit-student', {
            title: Group.GroupName, group: true, groupHeader: true, Group, Category, student,
            "Error": req.session.Error
        })
        req.session.Error = false
    } else {
        res.render('group/students/edit-student', {
            title: Group.GroupName, group: true, groupHeader: true, Group, Category, student
        })

    }
}

const postStudentEditPage = (req, res) => { 
    let Category = req.params.Category
    let Group = req.session.group
    let ChestNo = req.params.ChestNo
    studentHelpers.editStudentDetails(Group.EventId, ChestNo, req.body).then((response) => {
        if (response.Error) {
            req.session.Error = response.Error
            res.redirect('/group/students/' + Category + '/' + ChestNo + '/edit')
        } else {
            req.session.Success = response.Success
            res.redirect('/group/students/' + Category)
        }
    })
}
const deleteStudent = (req, res) => { 
    const Group = req.session.group
    const Category = req.params.Category
    let ChestNo = req.params.ChestNo
    studentHelpers.removeStudent(Group.EventId, Group.GroupId, ChestNo, Category).then((response) => {
        res.redirect('/group/students/' + Category)
    })
}

const getStudentWithOutItem = async (req, res) => { 
    const Group = req.session.group
    studentHelpers.GroupBaiseStudentWithOutItems(Group.EventId, Group.GroupId).then((Students) => {
        res.render('group/students/student-without-item', { title: Group.GroupName, group: true, groupHeader: true, Group, Students })
    })

}

module.exports = {
    getStudentsMainPage, getStudentsListPage, getCreateStudent, postCreateStudent, getStudentViewpage,
    deleteItem, getStudentEditPage, postStudentEditPage, deleteStudent, getStudentWithOutItem
}