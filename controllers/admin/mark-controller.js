const eventHelpers = require('../../helpers/event-helpers');
const itemHelpers = require('../../helpers/item-helpers');
const markHelpers = require('../../helpers/mark-helpers');

const getMainPage = async (req, res) => {  
    const Event = req.session.event
    const ItemCategorys = await itemHelpers.getAllItemCategory(Event.EventId)
   
    res.render('event/upload-mark/main-page', {
        title: Event.Name, eventHeader: true, Event, createAccout: true, adminHeader: true,
        ItemCategorys
    })
}

const activeUploadMark = (req, res) => {  
    const EventId = req.params.EventId
    markHelpers.activeUploadMark(EventId).then(() => {
        req.session.event.MarkStatus = true
        res.redirect('/event/' + EventId + '/mark')
    })
}

const getItemListOfMark = async (req, res) => {  
    const Event = req.session.event
    const Category = req.params.Category
    const SubCategory = req.params.SubCategory
    const allItems = await itemHelpers.getAllItems(Event.EventId, Category, SubCategory)
   
    res.render('event/upload-mark/category-items', {
        title: Event.Name, eventHeader: true, Event, createAccout: true, adminHeader: true,
        allItems, Category, SubCategory
    })
}

const changeResultStatus = (req, res) => {  
    markHelpers.changeResultStatus(req.body).then(() => {
        res.json({ Status: true })
    })
}

const getAddIndividualMarkPage = async (req, res) => {  
    const Event = req.session.event
    const Category = req.params.Category
    const SubCategory = req.params.SubCategory
    const ItemId = req.params.ItemId
    const ItemName = req.params.ItemName
    const ItemStudents = await itemHelpers.getItemStudentsFromAllGroup(Event.EventId, ItemId)

    res.render('event/upload-mark/add-individual-mark', {
        title: Event.Name, eventHeader: true, Event, createAccout: true, adminHeader: true,
        Category, SubCategory, ItemName, ItemStudents, ItemId
    })
}

const postAddIndividualMarkPage = (req, res) => {  
    const Event = req.session.event
    const Category = req.params.Category
    const SubCategory = req.params.SubCategory
    const ItemId = req.params.ItemId
    const ItemName = req.params.ItemName

    markHelpers.addIndividualMark(req.body, Event.EventId, Category, SubCategory, ItemId).then(() => {
        res.redirect('/event/' + Event.EventId + '/mark/' + Category + '-' + SubCategory + '/Individual/' + ItemId + '-' + ItemName + '/add-mark')

    })
}

const getAddGroupMarkPage = async (req, res) => {  
    const Event = req.session.event
    const Category = req.params.Category
    const SubCategory = req.params.SubCategory
    const ItemId = req.params.ItemId
    const ItemName = req.params.ItemName
    const ItemGroups = await markHelpers.getGroupItemMarksFromAllGroup(Event.EventId, ItemId)
 
    res.render('event/upload-mark/add-group-mark', {
        title: Event.Name, eventHeader: true, Event, createAccout: true, adminHeader: true,
        Category, SubCategory, ItemName, ItemId, ItemGroups
    })
}

const postAddGroupMarkPage = (req, res) => {  
    const Event = req.session.event
    const Category = req.params.Category
    const SubCategory = req.params.SubCategory
    const ItemId = req.params.ItemId
    const ItemName = req.params.ItemName

    markHelpers.addGroupMark(req.body, Event.EventId, Category, SubCategory, ItemId).then(() => {
        res.redirect('/event/' + Event.EventId + '/mark/' + Category + '-' + SubCategory + '/Group/' + ItemId + '-' + ItemName + '/add-mark')

    })
}

module.exports = {
    getMainPage, activeUploadMark, getItemListOfMark, changeResultStatus, getAddIndividualMarkPage,
    postAddIndividualMarkPage, getAddGroupMarkPage, postAddGroupMarkPage
}