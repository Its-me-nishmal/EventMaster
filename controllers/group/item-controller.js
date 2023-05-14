const groupHelpers = require('../../helpers/group-helpers')
const eventHelpers = require('../../helpers/event-helpers');
const studentHelpers = require('../../helpers/student-helpers');
const itemHelpers = require('../../helpers/item-helpers');

const getItemMainPage = async (req, res) => {////
    let Group = req.session.group
    let allItemCategorys = await itemHelpers.getAllItemCategory(Group.EventId)


    res.render('group/items/main-page', {
        title: Group.GroupName, group: true, groupHeader: true, Group, allItemCategorys
    })
}

const getItemListPage = async (req, res) => {////
    let Group = req.session.group
    let Category = req.params.Category
    let SubCategory = req.params.SubCategory
    let GroupDetails = await groupHelpers.getGroupDetails(Group.GroupId, Group.EventId)
    let allItems = await itemHelpers.getAllItemsForGroup(Group.EventId, Group.GroupId, Category, SubCategory)


    if (req.session.Error) {
        res.render('group/items/all-items', {
            title: Group.GroupName, group: true, groupHeader: true, Group, GroupDetails,
            Category, SubCategory, allItems, "Error": req.session.Error
        })
        req.session.Error = false

    } else if (req.session.Success) {
        res.render('group/items/all-items', {
            title: Group.GroupName, group: true, groupHeader: true, Group, GroupDetails,
            Category, SubCategory, allItems, "Success": req.session.Success
        })
        req.session.Success = false
    } else {
        res.render('group/items/all-items', {
            title: Group.GroupName, group: true, groupHeader: true, Group, GroupDetails,
            Category, SubCategory, allItems
        })
    }
}

const getItemStudents = async (req, res) => { ////
    let Group = req.session.group
    let Category = req.params.Category
    let SubCategory = req.params.SubCategory
    let ItemId = req.params.ItemId
    let ItemName = req.params.ItemName
    var Event = await eventHelpers.getEventDetails(Group.EventId)
    let ItemStudents = await itemHelpers.getItemStudentsFromOneGroup(Group.EventId, Group.GroupId, ItemId)
    let GroupDetails = await groupHelpers.getGroupDetails(Group.GroupId, Group.EventId)
    if (req.session.Success) {
        res.render('group/items/item-students', {
            title: Group.GroupName, group: true, groupHeader: true, Group, Category, SubCategory, ItemId, ItemName, ItemStudents,
            Event, "Success": req.session.Success, GroupDetails
        })
        req.session.Success = false

    } else if (req.session.Error) {
        res.render('group/items/item-students', {
            title: Group.GroupName, group: true, groupHeader: true, Group, Category, SubCategory, ItemId, ItemName, ItemStudents,
            Event, "Error": req.session.Error, GroupDetails
        })
        req.session.Error = false

    } else {
        res.render('group/items/item-students', {
            title: Group.GroupName, group: true, groupHeader: true, Group, Category, SubCategory, ItemId, ItemName, ItemStudents,
            Event, GroupDetails
        })
    }
}

const getChooseItemPage = async (req, res) => {////
    let Group = req.session.group
    let Category = req.params.Category
    let SubCategory = req.params.SubCategory
    let ItemId = req.params.ItemId
    let ItemName = req.params.ItemName
    let GroupDetails = await groupHelpers.getGroupDetails(Group.GroupId, Group.EventId)

    res.render('group/items/choose-item', {
        title: Group.GroupName, group: true, groupHeader: true, Group, Category,
        SubCategory, ItemId, ItemName, GroupDetails
    })
}

const postChooseItemPage = (req, res) => {////

    itemHelpers.addItemToStudent(req.body.EventId, req.body.Category, req.body.SubCategory, req.body).then((response) => {

        if (response.Error) {
            req.session.Error = response.Error
            res.redirect('/group/items/' + req.body.Category + '/' + req.body.SubCategory + '/all-items/' + req.body.ItemId + '-' + req.body.ItemName + '/all-students')
        } else if (response.Success) {
            req.session.Success = response.Success
            res.redirect('/group/items/' + req.body.Category + '/' + req.body.SubCategory + '/all-items/' + req.body.ItemId + '-' + req.body.ItemName + '/all-students')

        }
    })
}

const deleteStudentItem = (req, res) => {////
    let Group = req.session.group
    let Category = req.params.Category
    let SubCategory = req.params.SubCategory
    let ItemId = req.params.ItemId
    let ItemName = req.params.ItemName
    let ChestNo = req.params.ChestNo

    studentHelpers.deleteStudentItem(Group.EventId, ChestNo, ItemId).then(() => {
        res.redirect('/group/items/' + Category + '/' + SubCategory + '/all-items/' + ItemId + '-' + ItemName + '/all-students')

    });
}

module.exports = { getItemMainPage, getItemListPage, getItemStudents, getChooseItemPage, postChooseItemPage, deleteStudentItem }