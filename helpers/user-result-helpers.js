const db = require('../config/db')
const collection = require('../config/collections')
const groupHelpers = require('./group-helpers')
const studentHelpers = require('./student-helpers')

module.exports = {

    totalMarkAllGroups: (EventId) => { ////+++
        return new Promise(async (resolve, reject) => {
            let TotalMark = []
            // 1. Get Group Details
            let groups = await db.get().collection(collection.GROUP_COLLECTION).find({ EventId }).toArray()
            for (let i = 0; i < groups.length; i++) {
                let obj = {
                    GroupName: groups[i].GroupName,
                    GroupId: groups[i].GroupId,
                    TotalMark: 0
                }
                TotalMark.push(obj)
            }
            // 2. Get Category and Sub Cateogry Details
            let category = await db.get().collection(collection.ITEM_COLLECTION).find({ EventId }).toArray()
            for (let i = 0; i < category.length; i++) {
                delete category[i]._id
                delete category[i].EventId
                category[i].TotalMark = 0
                for (let j = 0; j < category[i].Sub.length; j++) {
                    delete category[i].Sub[j].Items
                    delete category[i].Sub[j].Count
                    delete category[i].Sub[j]?.GeneralLimit
                    delete category[i].Sub[j]?.Limit
                    category[i].Sub[j].TotalMark = 0
                }
            }
            for (let i = 0; i < TotalMark.length; i++) {
                TotalMark[i].Category = JSON.parse(JSON.stringify(category));
            }
            // 3. get students item details from item collection
            let students = await studentHelpers.getAllStudentItems(EventId)

            for (let i = 0; i < students.length; i++) {
                for (let a = 0; a < students[i].Items.length; a++) {
                    if (students[i].Items[a].Mark !== 0 && students[i].Items[a].ResultPublish === true) {
                        for (let j = 0; j < TotalMark.length; j++) {
                            if (TotalMark[j].GroupId === students[i].GroupId) {
                                for (let k = 0; k < TotalMark[j].Category.length; k++) {
                                    if (TotalMark[j].Category[k].CategoryName === students[i].Items[a].ItemCategory) {
                                        for (let m = 0; m < TotalMark[j].Category[k].Sub.length; m++) {
                                            if (TotalMark[j].Category[k].Sub[m].Title === students[i].Items[a].ItemSubCategory) {
                                         
                                                TotalMark[j].Category[k].Sub[m].TotalMark += students[i].Items[a].Mark
                                                TotalMark[j].Category[k].TotalMark += students[i].Items[a].Mark
                                                TotalMark[j].TotalMark += students[i].Items[a].Mark
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // 4. Get Group Mark 
            let groupMark = await groupHelpers.getAllGroupsGroupItem(EventId)

            for (let i = 0; i < groupMark.length; i++) {
                for (let a = 0; a < groupMark[i].Items.length; a++) {
                    if (groupMark[i].Items[a].Mark !== 0 && groupMark[i].Items[a].ResultPublish === true) {
                        for (let j = 0; j < TotalMark.length; j++) {
                            if (TotalMark[j].GroupId === groupMark[i].GroupId) {
                                for (let k = 0; k < TotalMark[j].Category.length; k++) {
                                    if (TotalMark[j].Category[k].CategoryName === groupMark[i].Items[a].ItemCategory) {
                                        for (let m = 0; m < TotalMark[j].Category[k].Sub.length; m++) {
                                            if (TotalMark[j].Category[k].Sub[m].Title === groupMark[i].Items[a].ItemSubCategory) {
                                    
                                                TotalMark[j].Category[k].Sub[m].TotalMark += groupMark[i].Items[a].Mark
                                                TotalMark[j].Category[k].TotalMark += groupMark[i].Items[a].Mark
                                                TotalMark[j].TotalMark += groupMark[i].Items[a].Mark
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }


            resolve(TotalMark)
        })

    },

    GrandWinnerStudent: (EventId) => { ////+++
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.STUDENTS_COLLECTION).aggregate([
                {
                    $match: {
                        EventId
                    }
                },
                {
                    $lookup: {
                        from: collection.ITEM_COLLECTION,
                        let: { itemIds: '$Items.ItemId' },
                        pipeline: [
                            {
                                $unwind: '$Sub'
                            },
                            {
                                $unwind: "$Sub.Items"
                            }, {
                                $match: {
                                    $expr: {
                                        $in: ["$Sub.Items.ItemId", '$$itemIds']
                                    }
                                }
                            },
                            {
                                $project: {
                                    _id: 0,
                                    ItemId: "$Sub.Items.ItemId",
                                    Name: "$Sub.Items.Name",
                                    ItemCategory: '$CategoryName',
                                    ItemSubCategory: '$Sub.Title',
                                    CategoryName: "$Sub.Items.CategoryName",
                                    Type: "$Sub.Items.Type",
                                    Limit: "$Sub.Items.Limit",
                                    ResultPublish: "$Sub.Items.ResultPublish",
                                    MarkAdded: "$Sub.Items.MarkAdded",
                                    Grade: '$itemIds.Grade'
                                }
                            }
                        ],

                        as: 'ItemDetails'
                    }
                },
                {
                    $addFields: {
                        "Items": {
                            $map: {
                                input: "$Items",
                                as: "item",
                                in: {
                                    $mergeObjects: [
                                        "$$item",
                                        {
                                            $arrayElemAt: [
                                                {
                                                    $filter: {
                                                        input: "$ItemDetails",
                                                        as: "detail",
                                                        cond: { $eq: ["$$detail.ItemId", "$$item.ItemId"] }
                                                    }
                                                },
                                                0
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    }
                },
                {
                    $lookup: {
                        from: collection.GROUP_COLLECTION,
                        localField: 'GroupId',
                        foreignField: 'GroupId',
                        as: 'group'
                    }
                },
                {
                    $project: {
                        _id: 0, Name: 1,
                        EventId: 1, GroupId: 1, Category: 1, ChestNo: 1, CicNo: 1, Items: 1,
                        GroupName: { $first: '$group.GroupName' }
                    }
                },
                {
                    $unwind: '$Items'
                },
                {
                    $match: {
                        "Items.ResultPublish": true
                    }
                },
                {
                    $group: {
                        _id: {
                            Category: '$Category', ChestNo: '$ChestNo', Name: '$Name',
                            EventId: '$EventId', GroupId: '$GroupId', CicNo: '$CicNo', GroupName: '$GroupName'
                        },
                        TotalMark: { $sum: "$Items.Mark" }
                    }
                },
                {
                    $project: {
                        Category: '$_id.Category', ChestNo: '$_id.ChestNo', Name: '$_id.Name',
                        EventId: '$_id.EventId', GroupId: '$_id.GroupId', CicNo: '$_id.CicNo', GroupName: '$_id.GroupName',
                        TotalMark: 1, _id: 0
                    }
                }
            ]).toArray().then((result) => {
                db.get().collection(collection.ITEM_COLLECTION).find({ EventId, CategoryName: { $nin: ["GENERAL"] } }).project({ _id: 0, CategoryName: 1 }).toArray().then((category) => {
                 
                    for (let i = 0; i < category.length; i++) {
                        category[i].students = []
                        for (let j = 0; j < result.length; j++) {
                            if (result[j].Category === category[i].CategoryName) {
                                category[i].students.push(result[j])
                            }
                        }
                    }
                    for (let i = 0; i < category.length; i++) {
                        category[i].students.sort((a, b) => b.TotalMark - a.TotalMark)
                        category[i].students = category[i].students.slice(0, 5)
                    }

                    resolve(category)
                })
            })
        })

    },

}