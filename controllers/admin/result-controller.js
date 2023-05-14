const eventHelpers = require("../../helpers/event-helpers")
const groupHelpers = require("../../helpers/group-helpers")
const itemHelpers = require("../../helpers/item-helpers")
const markHelpers = require("../../helpers/mark-helpers")
const resultHelpers = require("../../helpers/result-helpers")
const studentHelpers = require("../../helpers/student-helpers")


const getResultHomePage = async (req, res) => {  ////
    const Event = req.session.event
    let TotalItemCount = await itemHelpers.AllItemCount(Event.EventId)
    let totalGroupsMark = await resultHelpers.totalMarkAllGroups(Event.EventId)

    res.render('event/result/home', {
        title: Event.Name, eventHeader: true, Event, createAccout: true, adminHeader: true,
        TotalItemCount, totalGroupsMark
    })
}

const getCategoryBaisePublishedStatus = async (req, res) => {  ////
    let Event = req.session.event
    let TotalItemCount = await itemHelpers.AllItemCount(Event.EventId)
    res.render('event/result/published-status', {
        title: Event.Name, eventHeader: true, Event, createAccout: true, adminHeader: true,
        TotalItemCount
    })
}

const getItemBaiseResultPage = async (req, res) => {  ////
    let Event = req.session.event
    var ItemCategorys = await itemHelpers.getAllItemCategory(Event.EventId)

    res.render('event/result/item-baise', {
        title: Event.Name, eventHeader: true, Event, createAccout: true, adminHeader: true,
        ItemCategorys
    })
}

const searchItemBaise = (req, res) => {  ////
    itemHelpers.searchItem(req.body).then((searchResult) => {
        res.json(searchResult)
    })
}

const getItemBaiseSubPage = async (req, res) => {  ////
    let Event = req.session.event
    var Category = req.params.Category
    var SubCategory = req.params.SubCategory
    var allItems = await itemHelpers.getAllItems(Event.EventId, Category, SubCategory)

    res.render('event/result/category-item', {
        title: Event.Name, eventHeader: true, Event, createAccout: true, adminHeader: true, SubCategory, Category,
        allItems
    })
}

const getItemBaiseIndividualStudents = async (req, res) => {  ////
    let Event = req.session.event
    const SubCategory = req.params.SubCategory
    const Category = req.params.Category
    const ItemId = req.params.ItemId
    const ItemName = req.params.ItemName
    let ItemStudents = await itemHelpers.getItemStudentsFromAllGroup(Event.EventId, ItemId)

    res.render('event/result/individual-baise-student', {
        title: Event.Name, eventHeader: true, Event, createAccout: true, adminHeader: true, SubCategory, Category,
        ItemId, ItemName, ItemStudents
    })
}

const getItemBaiseGroupStudents = async (req, res) => {  ////
    let Event = req.session.event
    const SubCategory = req.params.SubCategory
    const Category = req.params.Category
    const ItemId = req.params.ItemId
    const ItemName = req.params.ItemName
    let ItemDetails = await markHelpers.getGroupItemMarksFromAllGroup(Event.EventId, ItemId)

    res.render('event/result/group-baise-student', {
        title: Event.Name, eventHeader: true, Event, createAccout: true, adminHeader: true, SubCategory, Category,
        ItemId, ItemName, ItemDetails
    })
}

const getStudentBaiseResultPage = async (req, res) => {  ////
    var Event = req.session.event
    var AllGroups = await groupHelpers.getAllGroups(Event.EventId)

    res.render('event/result/student-baise', { title: Event.Name, eventHeader: true, Event, createAccout: true, adminHeader: true, AllGroups })
}

const searchStudentsBaise = (req, res) => {  ////
    studentHelpers.searchStudent(req.body).then((searchResult) => {
        res.json(searchResult)
    })
}

const getStudentBaiseSubPage = async (req, res) => {  ////
    const Event = req.session.event
    const GroupId = req.params.GroupId
    let GroupDetails = await groupHelpers.getGroupDetails(GroupId, Event.EventId)

    res.render('event/result/student-baise-category', {
        title: Event.Name, eventHeader: true, Event, createAccout: true, adminHeader: true, GroupDetails
    })
}

const getStudentBaiseList = async (req, res) => {  ////
    var Event = req.session.event
    var GroupId = req.params.GroupId
    let GroupDetails = await groupHelpers.getGroupDetails(GroupId, Event.EventId)
    let Category = req.params.Category
    let AllStudents = await studentHelpers.getAllStudentsInGroup(Event.EventId, GroupId, Category)

    res.render('event/result/student-baise-list', {
        title: Event.Name, eventHeader: true, Event, createAccout: true, adminHeader: true,
        GroupDetails, AllStudents, Category,
    })
}

const getStudentBaiseItems = async (req, res) => {  ////
    var Event = req.session.event
    var GroupId = req.params.GroupId
    let Category = req.params.Category
    let ChestNo = req.params.ChestNo
    let GroupDetails = await groupHelpers.getGroupDetails(GroupId, Event.EventId)
    let studentEvents = await studentHelpers.getOneStudentItems(Event.EventId, ChestNo)
    let totalMark = 0
    for (let i = 0; i < studentEvents.Items.length; i++) {
        if (studentEvents.Items[i].MarkAdded) {
            totalMark += studentEvents.Items[i].Mark
        }
    }

    res.render('event/result/student-baise-items', {
        title: Event.Name, eventHeader: true, createAccout: true, adminHeader: true, Category, Event, studentEvents, GroupId,
        GroupDetails, totalMark
    })
}

const getGrandWinnerStudents = async (req, res) => {  ////
    let Event = req.session.event
    let result = await resultHelpers.GrandWinnerStudent(Event.EventId)
    res.render('event/result/grand-winner-student', {
        title: Event.Name, eventHeader: true, createAccout: true, adminHeader: true, Event,
        result
    })

}

module.exports = {
    getResultHomePage, getCategoryBaisePublishedStatus, getItemBaiseResultPage, searchItemBaise,
    getItemBaiseSubPage, getItemBaiseIndividualStudents, getItemBaiseGroupStudents, getStudentBaiseResultPage,
    searchStudentsBaise, getStudentBaiseSubPage, getStudentBaiseList, getStudentBaiseItems, getGrandWinnerStudents
}