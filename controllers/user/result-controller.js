const userItemHelpers = require("../../helpers/user-item-helpers");
const userResultHelpers = require('../../helpers/user-result-helpers')
const itemHelpers = require('../../helpers/item-helpers');
const groupHelpers = require("../../helpers/group-helpers");
const studentHelpers = require("../../helpers/student-helpers");

const getResultHomePage = async (req, res) => {
    const eventDetails = req.session.e
    let TotalItemCount = await itemHelpers.AllItemCount(eventDetails.EventId)
    let totalGroupsMark = await userResultHelpers.totalMarkAllGroups(eventDetails.EventId)
    let Pendig = TotalItemCount?.TotalItems - TotalItemCount?.PublishedItems

    res.render('user/result/home', {
        title: eventDetails.Name, eventDetails, TotalItemCount, totalGroupsMark, Pendig
    });
}

const getCategoryStatus = async (req, res) => {
    const eventDetails = req.session.e
    let TotalItemCount = await itemHelpers.AllItemCount(eventDetails.EventId)
    res.render('user/result/category-status', { title: eventDetails.Name, eventDetails, TotalItemCount })
}

const getItemBaiseResultPage = async (req, res) => {
    const eventDetails = req.session.e
    const ItemCategorys = await itemHelpers.getAllItemCategory(eventDetails.EventId)
    res.render('user/result/item-baise', {
        title: eventDetails.Name, eventDetails, ItemCategorys
    })
}

const searchItemBaise = (req, res) => {
    itemHelpers.searchItem(req.body).then((searchResult) => {
        res.json(searchResult)
    })
}

const getItemBaiseSubPage = async (req, res) => {
    const eventDetails = req.session.e
    const Category = req.params.Category
    const SubCategory = req.params.SubCategory
    const allItems = await itemHelpers.getAllItems(eventDetails.EventId, Category, SubCategory)
    res.render('user/result/item-category-list', {
        title: eventDetails.Name, eventDetails, SubCategory, Category, allItems
    })
}

const getItemBaiseIndividualStudents = async (req, res) => {
    let eventDetails = req.session.e
    const SubCategory = req.params.SubCategory
    const Category = req.params.Category
    const ItemId = req.params.ItemId
    const ItemName = req.params.ItemName
    let ItemStudents = await userItemHelpers.getItemStudentsFromAllGroup(eventDetails.EventId, Category, SubCategory, ItemId)
    res.render('user/result/item-baise-individual-student', {
        title: eventDetails.Name, eventDetails, SubCategory, Category, ItemId, ItemName, ItemStudents
    })
}

const getItemBaiseGroupStudents = async (req, res) => {
    let eventDetails = req.session.e
    const SubCategory = req.params.SubCategory
    const Category = req.params.Category
    const ItemId = req.params.ItemId
    const ItemName = req.params.ItemName
    let ItemGroups = await userItemHelpers.getGroupItemMarksFromAllGroup(eventDetails.EventId, Category, SubCategory, ItemId)

    res.render('user/result/item-baise-group-student', {
        title: eventDetails.Name, eventDetails, SubCategory, Category, ItemId, ItemName, ItemGroups
    })
}

const getStudentBaiseResultPage = async (req, res) => {
    const eventDetails = req.session.e
    const AllGroups = await groupHelpers.getAllGroups(eventDetails.EventId)
    res.render('user/result/student-baise', { title: eventDetails.Name, eventDetails, AllGroups })
}

const searchStudentsBaise = (req, res) => {
    studentHelpers.searchStudent(req.body).then((searchResult) => {
        res.json(searchResult)
    })
}

const getStudentBaiseSubPage = async (req, res) => {
    const eventDetails = req.session.e
    const GroupId = req.params.GroupId
    let GroupDetails = await groupHelpers.getGroupDetails(GroupId, eventDetails.EventId)
    res.render('user/result/student-baise-category', {
        title: eventDetails.Name, eventDetails, GroupDetails,
    })
}

const getStudentBaiseList = async (req, res) => {
    var eventDetails = req.session.e
    var GroupId = req.params.GroupId
    let GroupDetails = await groupHelpers.getGroupDetails(GroupId, eventDetails.EventId)
    let Category = req.params.Category
    let AllStudents = await studentHelpers.getAllStudentsInGroup(eventDetails.EventId, GroupId, Category)
    res.render('user/result/student-baise-list', {
        title: eventDetails.Name, eventDetails, GroupDetails, AllStudents, Category,
    })
}

const getStudentBaiseItems = async (req, res) => {
    var eventDetails = req.session.e
    var GroupId = req.params.GroupId
    let Category = req.params.Category
    let ChestNo = req.params.ChestNo
    let GroupDetails = await groupHelpers.getGroupDetails(GroupId, eventDetails.EventId)
    let studentItems = await studentHelpers.getOneStudentItems(eventDetails.EventId, ChestNo)
    let totalMark = 0
    for (let i = 0; i < studentItems.Items.length; i++) {
        if (studentItems.Items[i].ResultPublish) {
            totalMark += studentItems.Items[i].Mark
        }
    }
    res.render('user/result/student-baise-items', {
        title: eventDetails.Name, Category, eventDetails, studentItems, GroupId, GroupDetails, totalMark
    })
}

const getGrandWinnerStudents = async (req, res) => {
    let eventDetails = req.session.e
    let result = await userResultHelpers.GrandWinnerStudent(eventDetails.EventId)
    res.render('user/result/grand-winner-student', { title: eventDetails.Name, eventDetails, result })
}



module.exports = {
    getResultHomePage, getCategoryStatus, getItemBaiseResultPage, searchItemBaise, getItemBaiseSubPage,
    getItemBaiseIndividualStudents, getItemBaiseGroupStudents, getStudentBaiseResultPage, searchStudentsBaise,
    getStudentBaiseSubPage, getStudentBaiseList, getStudentBaiseItems, getGrandWinnerStudents
}