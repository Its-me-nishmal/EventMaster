const eventHelpers = require('../../helpers/event-helpers')
const groupHelpers = require('../../helpers/group-helpers')
const itemHelpers = require('../../helpers/item-helpers')
const studentHelpers = require('../../helpers/student-helpers')



const getGroupsList = async (req, res) => {     
    const Event = req.session.event
    const AllGroups = await groupHelpers.getAllGroups(Event.EventId)

    res.render('event/groups/groups-list', { title: Event.Name, eventHeader: true, createAccout: true, adminHeader: true, Event, AllGroups })
}

const postActiveGroup = (req, res) => {   
    const EventId = req.params.EventId
    const GroupName = req.params.GroupName

    groupHelpers.ActivateGroup(EventId, GroupName, req.body).then(() => {
        res.redirect('/event/' + EventId + '/groups')
    })
}

const getGroupViewPage = async (req, res) => {   
    const Event = req.session.event
    const GroupId = req.params.GroupId
    const GroupDetails = await groupHelpers.getGroupDetails(GroupId, Event.EventId)
    const allItemCategorys = await itemHelpers.getAllItemCategory(Event.EventId)

    res.render('event/groups/view-group', {
        title: Event.Name, eventHeader: true, createAccout: true, adminHeader: true, Event,
        GroupDetails, allItemCategorys
    })

}

const getGroupStudentsList = async (req, res) => {   
    const Event = req.session.event
    const GroupId = req.params.GroupId
    let GroupDetails = await groupHelpers.getGroupDetails(GroupId, Event.EventId)
    let Category = req.params.Category
    let EventLimit = await itemHelpers.findOneItemInCategory(Event.EventId, Category)
    let AllStudents = await studentHelpers.getAllStudentsInGroup(Event.EventId, GroupId, Category)

    res.render('event/groups/view-students', {
        title: Event.Name, eventHeader: true, createAccout: true, adminHeader: true, Category, Event, GroupDetails,
        AllStudents, EventLimit
    })


}

const getAddStudentPage = async (req, res) => {   
    const Event = req.session.event
    let GroupDetails = await groupHelpers.getGroupDetails(req.params.GroupId, Event.EventId)
    let Category = req.params.Category


    if (req.session.Error) {
        res.render('event/groups/add-students', {
            title: Event.Name, eventHeader: true, createAccout: true, adminHeader: true, Category, Event, GroupDetails,
            "Error": req.session.Error
        })
        req.session.Error = false
    } else if (req.session.Success) {
        res.render('event/groups/add-students', {
            title: Event.Name, eventHeader: true, createAccout: true, adminHeader: true, Category, Event, GroupDetails,
            "Success": req.session.Success
        })
        req.session.Success = false
    } else {
        res.render('event/groups/add-students', {
            title: Event.Name, eventHeader: true, createAccout: true, adminHeader: true, Category, Event, GroupDetails

        })
    }
}

const postAddStudent = async (req, res) => {   
    const Event = req.session.event
    const GroupId = req.params.GroupId
    const Category = req.params.Category
    studentHelpers.createStudent(Event.EventId, GroupId, Category, req.body).then((response) => {

        if (response) {
            req.session.Error = "CIC number already used"
            res.redirect('/event/' + Event.EventId + '/groups/' + GroupId + '/' + Category + '/students/add-student')
        } else {
            req.session.Success = "New Student created"
            res.redirect('/event/' + Event.EventId + '/groups/' + GroupId + '/' + Category + '/students/add-student')
        }
    })
}

const deleteStudent = (req, res) => {   
    const EventId = req.session.event.EventId
    const GroupId = req.params.GroupId
    const Category = req.params.Category
    let ChestNo = req.params.ChestNo
    studentHelpers.removeStudent(EventId, GroupId, ChestNo, Category).then((response) => {
        res.redirect('/event/' + EventId + '/groups/' + GroupId + '/' + Category + '/students')
    })

}
const getStudentsEventPage = async (req, res) => {   
    const Event = req.session.event
    const GroupDetails = await groupHelpers.getGroupDetails(req.params.GroupId, Event.EventId)
    const Category = req.params.Category
    const ChestNo = req.params.ChestNo
    const studentEvents = await studentHelpers.getOneStudentItems(Event.EventId, ChestNo)
    const EventLimit = await itemHelpers.findOneItemInCategory(Event.EventId, Category)
   
    if (req.session.Error) {
        res.render('event/groups/view-student-events', {
            title: Event.Name, eventHeader: true, createAccout: true, adminHeader: true, Category, Event, studentEvents, GroupDetails,
            EventLimit, "Error": req.session.Error
        })
        req.session.Error = false
    } else {
        res.render('event/groups/view-student-events', {
            title: Event.Name, eventHeader: true, createAccout: true, adminHeader: true, Category, Event, studentEvents, GroupDetails,
            EventLimit
        })

    }

}

const deleteItemFormStudent = async (req, res) => {   
    const EventId = req.session.event.EventId
    const GroupId = req.params.GroupId
    const Category = req.params.Category
    let ChestNo = req.params.ChestNo
    let ItemId = req.params.ItemId

    studentHelpers.deleteStudentItem(EventId, ChestNo, ItemId).then(() => {

        res.redirect('/event/' + EventId + '/groups/' + GroupId + '/' + Category + '/students/' + ChestNo + '/view')

    })
}

module.exports = {
    getGroupsList, postActiveGroup, getGroupViewPage, getGroupStudentsList,
    getAddStudentPage, postAddStudent, deleteStudent, getStudentsEventPage, deleteItemFormStudent
}