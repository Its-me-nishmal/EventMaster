const eventHelpers = require("../../helpers/event-helpers")
const groupHelpers = require("../../helpers/group-helpers")
const itemHelpers = require("../../helpers/item-helpers")
const studentHelpers = require("../../helpers/student-helpers")


// Event Item

const getEventItemPage = async (req, res) => {  
    const Event = req.session.event
    const PointsCount = await eventHelpers.getPointsCount(Event.EventId)
    const allItemCategorys = await eventHelpers.getAllItemCategoryWithItems(Event.EventId)

    res.render('event/items/items', {
        title: Event.Name, eventHeader: true, createAccout: true, adminHeader: true, Event,
        PointsCount, allItemCategorys
    })
}

const getItemListPage = async (req, res) => {  
    const Event = req.session.event
    const Category = req.params.Category
    const SubCategory = req.params.SubCategory

    const allItems = await itemHelpers.getAllItems(Event.EventId, Category, SubCategory)
    if (req.session.Error) {
        res.render('event/items/all-item', {
            title: Event.Name, eventHeader: true, createAccout: true, adminHeader: true, Event,
            allItems, "Error": req.session.Error, Category, SubCategory
        })
        req.session.Error = false
    } else if (req.session.Success) {
        res.render('event/items/all-item', {
            title: Event.Name, eventHeader: true, createAccout: true, adminHeader: true, Event,
            allItems, "Success": req.session.Success, Category, SubCategory
        })
        req.session.Success = false
    } else {
        res.render('event/items/all-item', {
            title: Event.Name, eventHeader: true, createAccout: true, adminHeader: true, Event,
            allItems, Category, SubCategory
        })
    }
}

const getAddItemPage = async (req, res) => {  
    const Event = req.session.event
    const Category = req.params.Category
    const SubCategory = req.params.SubCategory
    var pointCategoryOptions = await eventHelpers.getPointCategoryOptions(Event.EventId)
   
    if (req.session.Success) {
        res.render('event/items/add-item', {
            "Success": req.session.Success,
            title: Event.Name, eventHeader: true, createAccout: true, adminHeader: true, Event, pointCategoryOptions, Category, SubCategory
        })
        req.session.Success = false
    } else {
        res.render('event/items/add-item', {
            title: Event.Name, eventHeader: true, createAccout: true, adminHeader: true, Event,
            Category, SubCategory, pointCategoryOptions
        })
    }
}

const postAddItem = (req, res) => {  
    const EventId = req.params.EventId
    const Category = req.params.Category
    const SubCategory = req.params.SubCategory
    itemHelpers.addItem(req.body, EventId, Category, SubCategory).then((response) => {
        if (response) {
            req.session.Success = "New Item created"
            res.redirect('/event/' + EventId + '/event-items/' + Category + '-' + SubCategory + '/add-event')
        } else {
            res.redirect('/event/' + EventId + '/event-items/' + Category + '-' + SubCategory + '/add-event')
        }
    })
}

const getEditItem = async (req, res) => {  
    const EventId = req.params.EventId
    const Category = req.params.Category
    const SubCategory = req.params.SubCategory
    const ItemId = req.params.ItemId
    const Event = req.session.event
    const pointCategoryOptions = await eventHelpers.getPointCategoryOptions(EventId)
    itemHelpers.getOneItemDetails(EventId, Category, SubCategory, ItemId).then((result) => {
        if (result.Type == "Group") {
            result.Group = true
        } else {
            result.Intivi = true
        }
        for (let i = 0; i < pointCategoryOptions.length; i++) {
            if (pointCategoryOptions[i].CategoryName == result.CategoryName) {
                pointCategoryOptions[i].index = true
            }
        }

        res.render("event/items/edit-item", {
            title: Event.Name, eventHeader: true, createAccout: true, adminHeader: true, Event,
            Category, SubCategory, result, pointCategoryOptions
        })

    })
}

const postEditItem = (req, res) => {  

    let EventId = req.params.EventId
    let Category = req.params.Category
    let SubCategory = req.params.SubCategory

    itemHelpers.editItemDetails(EventId, Category, SubCategory, req.body).then((result) => {
        req.session.Success = 'Updated'
        res.redirect('/event/' + EventId + "/event-items/" + Category + "-" + SubCategory)
    })
}

const deleteItem = (req, res) => {  
    const EventId = req.params.EventId
    const Category = req.params.Category
    const SubCategory = req.params.SubCategory
    const ItemId = req.params.ItemId
    const itemCategory = req.query.itemCategory
   
    itemHelpers.deleteItem(EventId, Category, SubCategory, ItemId, itemCategory).then((response) => {
        if (response) {
            req.session.Error = response.Error
            res.redirect('/event/' + EventId + '/event-items/' + Category + '-' + SubCategory)
        } else {
            res.redirect('/event/' + EventId + '/event-items/' + Category + '-' + SubCategory)
        }
    })
}

const getItemAllStudents = async (req, res) => {  
    let Event = req.session.event
    let Category = req.params.Category
    let SubCategory = req.params.SubCategory
    let ItemId = req.params.ItemId
    let ItemName = req.params.ItemName
    let Students = await itemHelpers.getItemStudentsFromAllGroup(Event.EventId, ItemId)

    if (req.session.Error) {
        res.render('event/items/all-students', {
            title: Event.Name, eventHeader: true, createAccout: true, adminHeader: true, Event, ItemName, Students,
            Category, SubCategory, ItemId, "Error": req.session.Error
        });
        req.session.Error = false
    } else {
        res.render('event/items/all-students', {
            title: Event.Name, eventHeader: true, createAccout: true, adminHeader: true, Event, ItemName, Students,
            Category, SubCategory, ItemId
        })
    }
}

const getAddStudentToItemPage = async (req, res) => {  

    let Event = req.session.event
    let Category = req.params.Category
    let SubCategory = req.params.SubCategory
    let ItemId = req.params.ItemId
    let ItemName = req.params.ItemName
    const GroupList = await groupHelpers.getAllGroups(Event.EventId)

    if (req.session.Error) {
        res.render('event/items/add-student', {
            title: Event.Name, eventHeader: true, createAccout: true, adminHeader: true, Event, ItemName,
            Category, SubCategory, ItemId, "Error": req.session.Error, GroupList
        })
        req.session.Error = false

    } else if (req.session.Success) {
        res.render('event/items/add-student', {
            title: Event.Name, eventHeader: true, createAccout: true, adminHeader: true, Event, ItemName,
            Category, SubCategory, ItemId, "Success": req.session.Success, GroupList
        })
        req.session.Success = false
    } else {
        res.render('event/items/add-student', {
            title: Event.Name, eventHeader: true, createAccout: true, adminHeader: true, Event, ItemName,
            Category, SubCategory, ItemId, GroupList
        })

    }
}

const postAddStudentToItem = (req, res) => {  
    let Event = req.session.event
    let Category = req.params.Category
    let SubCategory = req.params.SubCategory
    let ItemId = req.params.ItemId
    let ItemName = req.params.ItemName

    itemHelpers.addItemToStudent(Event.EventId, Category, SubCategory, req.body).then((response) => {
        if (response.Error) {
            req.session.Error = response.Error
            res.redirect('/event/' + Event.EventId + '/event-items/' + Category + '-' + SubCategory + '/' + ItemId + '-' + ItemName + '/add-students')

        } else if (response.Success) {
            req.session.Success = response.Success
            res.redirect('/event/' + Event.EventId + '/event-items/' + Category + '-' + SubCategory + '/' + ItemId + '-' + ItemName + '/add-students')
        }
    })
}

const deleteStudentFromItem = (req, res) => {  
    let Event = req.session.event
    let Category = req.params.Category
    let SubCategory = req.params.SubCategory
    let ItemId = req.params.ItemId
    let ChestNo = req.params.ChestNo
    let ItemName = req.params.ItemName

    studentHelpers.deleteStudentItem(Event.EventId, ChestNo, ItemId).then(() => {

        res.redirect('/event/' + Event.EventId + '/event-items/' + Category + '-' + SubCategory + '/' + ItemId + '-' + ItemName + '/all-students')

    })
}




module.exports = {
    getEventItemPage, getItemListPage, getAddItemPage, postAddItem, getEditItem, postEditItem, deleteItem,
    getItemAllStudents, getAddStudentToItemPage, postAddStudentToItem, deleteStudentFromItem,
}