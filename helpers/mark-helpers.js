var db = require('../config/db')
var collection = require('../config/collections')
const eventHelpers = require('./event-helpers');
const studentHelpers = require('./student-helpers');
const itemHelpers = require('./item-helpers');

module.exports = {

    activeUploadMark: (EventId) => { 
        return new Promise((resolve, reject) => {
            db.get().collection(collection.EVENT_COLLECTION).updateOne({ EventId }, {
                $set: {
                    MarkStatus: true
                }
            }).then(() => {
                resolve()
            })
        })
    },

    deactiveUploadMark: ({ EventId, Status }) => {  
        return new Promise(async (resolve, reject) => {
            if (Status === 'true') {
                db.get().collection(collection.EVENT_COLLECTION).updateOne({ EventId }, {
                    $set: {
                        MarkStatus: false
                    }
                }).then(() => {
                    resolve({ Status: false })
                })
            } else {
                resolve({ Status: true })
            }
        })

    },
    
    changeResultStatus: ({ EventId, ResultPublish, ItemId, Category, SubCategory }) => { 

        return new Promise((resolve, reject) => {
            if (ResultPublish === "true") {
                db.get().collection(collection.ITEM_COLLECTION).update({ EventId, CategoryName: Category, 'Sub.Title': SubCategory, 'Sub.Items.ItemId': ItemId }, {
                    $set: {

                        "Sub.$[outer].Items.$[inner].ResultPublish": false,

                    }
                }, {
                    arrayFilters: [
                        {
                            "outer.Title": SubCategory
                        },
                        {
                            "inner.ItemId": ItemId
                        }
                    ]
                }).then(() => {
                    resolve()
                })
            } else {
                db.get().collection(collection.ITEM_COLLECTION).update({ EventId, CategoryName: Category, 'Sub.Title': SubCategory, 'Sub.Items.ItemId': ItemId }, {
                    $set: {

                        "Sub.$[outer].Items.$[inner].ResultPublish": true,

                    }
                }, {
                    arrayFilters: [
                        {
                            "outer.Title": SubCategory
                        },
                        {
                            "inner.ItemId": ItemId
                        }
                    ]
                }).then(() => {
                    resolve()
                })
            }
        })
    },

    addIndividualMark: (body, EventId, Category, SubCategory, ItemId) => {  
    
        return new Promise(async (resolve, reject) => {
            let oldMark = await studentHelpers.getStudentOneItem(EventId, body.ChestNo, ItemId)
            const ItemDetails = await itemHelpers.getOneItemDetails(EventId, Category, SubCategory, ItemId)
            const ItemPointCategory = await eventHelpers.getOnePointDetails(EventId, ItemDetails.CategoryName)
            const Mark = Number((body.places !== 'null' ? ItemPointCategory.Places[body.places] : 0) + (body.grades !== 'null' ? ItemPointCategory.Grades[body.grades] : 0))
            oldMark = Mark - oldMark.Mark
            await db.get().collection(collection.STUDENTS_COLLECTION).updateOne({ EventId, ChestNo: body.ChestNo, 'Items.ItemId': ItemId }, {
                $set: {
                    'Items.$.Place': body.places !== 'null' ? body.places : null,
                    'Items.$.Grade': body.grades !== 'null' ? body.grades : null,
                    'Items.$.Mark': Mark
                }
            }).then(() => {
                db.get().collection(collection.ITEM_COLLECTION).update({ EventId, CategoryName: Category, "Sub.Title": SubCategory, "Sub.Items.ItemId": ItemId },
                    {
                        $set: {

                            "Sub.$[outer].Items.$[inner].MarkAdded": true,

                        }
                    },
                    {
                        arrayFilters: [
                            {
                                "outer.Title": SubCategory
                            },
                            {
                                "inner.ItemId": ItemId
                            }
                        ]
                    }).then(() => {
                       
                        resolve()
                       
                    })
            })

        })

    },

    addGroupMark: (body, EventId, Category, SubCategory, ItemId) => { 
        return new Promise(async (resolve, reject) => {

            let oldMark = await db.get().collection(collection.GROUP_COLLECTION).findOne({ EventId, GroupId: body.GroupId, "GroupItems.ItemId": ItemId },
                { projection: { GroupItems: { $elemMatch: { ItemId } } } })
            const ItemDetails = await itemHelpers.getOneItemDetails(EventId, Category, SubCategory, ItemId)
            const ItemPointCategory = await eventHelpers.getOnePointDetails(EventId, ItemDetails.CategoryName)
            const Mark = Number((body.places !== 'null' ? ItemPointCategory.Places[body.places] : 0) + (body.grades !== 'null' ? ItemPointCategory.Grades[body.grades] : 0))
            oldMark = oldMark?.GroupItems[0]?.Mark ? oldMark?.GroupItems[0]?.Mark : 0
            oldMark = Mark - oldMark
            const groupItem = {
                ItemId,
                Grade: body.grades,
                Place: body.places,
                Mark
            };
            await db.get().collection(collection.GROUP_COLLECTION).updateOne({ EventId, GroupId: body.GroupId, "GroupItems.ItemId": ItemId }, {
                $pull: { GroupItems: { ItemId } },
            })
            await db.get().collection(collection.GROUP_COLLECTION).updateOne({ EventId, GroupId: body.GroupId, 'Category.CategoryName': Category }, {
                $push: { GroupItems: groupItem }
                
            }).then(() => {
                db.get().collection(collection.STUDENTS_COLLECTION).update({ EventId, GroupId: body.GroupId, 'Items.ItemId': ItemId }, {
                    $set: {
                        'Items.$.Place': body.places !== 'null' ? body.places : null,
                        'Items.$.Grade': body.grades !== 'null' ? body.grades : null,
                    }
                }).then(() => {
                    db.get().collection(collection.ITEM_COLLECTION).update({ EventId, CategoryName: Category, "Sub.Title": SubCategory, "Sub.Items.ItemId": ItemId },
                        {
                            $set: {

                                "Sub.$[outer].Items.$[inner].MarkAdded": true,

                            }
                        },
                        {
                            arrayFilters: [
                                {
                                    "outer.Title": SubCategory
                                },
                                {
                                    "inner.ItemId": ItemId
                                }
                            ]
                        }).then(() => {
                            resolve()
                        })
                })
            })
        })

    },

    getGroupItemMarksFromAllGroup: (EventId, ItemId) => { 
        return new Promise((resolve, reject) => {
            db.get().collection(collection.GROUP_COLLECTION).aggregate([
                {
                    $match: {
                        EventId
                    }
                },
                {
                    $project: {
                        EventId: 1, GroupName: 1, GroupId: 1,
                        Item: {
                            $arrayElemAt: [
                                {
                                    $filter: {
                                        input: '$GroupItems',
                                        as: 'items',
                                        cond: { $eq: ["$$items.ItemId", ItemId] }
                                    }
                                }, 0
                            ]
                        }
                    }
                }
            ]).toArray().then((result) => {
                resolve(result)
            })
        })
    },

}