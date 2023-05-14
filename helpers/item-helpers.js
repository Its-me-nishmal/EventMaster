const db = require('../config/db')
const collection = require('../config/collections')
const studentHelpers = require('./student-helpers');
const eventHelpers = require('./event-helpers');
const { createRandomId } = require('./function-helpers');

module.exports = {
    getAllItemCategory: (EventId) => { ////*
        return new Promise(async (resolve, reject) => {
            let allItemCategory = await db.get().collection(collection.ITEM_COLLECTION).find({ EventId })
                .project({ "Sub.Items": 0 }).toArray()
            resolve(allItemCategory)
        })

    },

    searchItem: (body) => {  ////*
        return new Promise(async (resolve, reject) => {
            let searchResult = []

            if (body.searchValue == "") {
                resolve(searchResult.empty = 0)
            } else {

                let searchValue = body.searchValue;
                await db.get().collection(collection.ITEM_COLLECTION).aggregate([
                    {
                        $match: {
                            EventId: body.EventId,
                            $or: [
                                {
                                    "Sub.Items.Name": {
                                        $regex: new RegExp(searchValue, "i")
                                    }
                                },
                                {
                                    "Sub.Items.ItemId": {
                                        $regex: new RegExp(searchValue, "i")
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $project: {
                            CategoryName: 1,
                            "Sub": {
                                $map: {
                                    input: "$Sub",
                                    as: "sub",
                                    in: {
                                        $mergeObjects: [
                                            "$$sub",
                                            {
                                                "Items": {
                                                    $filter: {
                                                        input: "$$sub.Items",
                                                        as: "item",
                                                        cond: {
                                                            $or: [
                                                                {
                                                                    $regexMatch: {
                                                                        input: "$$item.Name",
                                                                        regex: new RegExp(searchValue, "i")
                                                                    }
                                                                },
                                                                {
                                                                    $regexMatch: {
                                                                        input: "$$item.ItemId",
                                                                        regex: new RegExp(searchValue, "i")
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                ])
                    .toArray().then((result) => {

                        resolve(result)
                    })

            }
        })

    },

    AllItemCount: (EventId) => { ////*
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.ITEM_COLLECTION).aggregate([
                // Match documents with non-empty Sub arrays
                {
                    $match: {
                        EventId,
                        "Sub": { $not: { $size: 0 } }
                    }
                },
                // Unwind the Sub array
                { $unwind: "$Sub" },
                // Group by EventId and CategoryName
                {
                    $group: {
                        _id: {
                            EventId: "$EventId",
                            CategoryName: "$CategoryName"
                        },
                        TotalItems: { $sum: "$Sub.Count" },
                        PublishedItems: {
                            $sum: {
                                $size: {
                                    $filter: {
                                        input: "$Sub.Items",
                                        as: "item",
                                        cond: { $eq: ["$$item.ResultPublish", true] }
                                    }
                                }
                            }
                        },
                        MarkAddedItems: {
                            $sum: {
                                $size: {
                                    $filter: {
                                        input: "$Sub.Items",
                                        as: "item",
                                        cond: { $eq: ["$$item.MarkAdded", true] }
                                    }
                                }
                            }
                        }
                    }
                },
                // Group by EventId only and add the counts
                {
                    $group: {
                        _id: "$_id.EventId",
                        counts: {
                            $push: {
                                CategoryName: "$_id.CategoryName",
                                TotalItems: "$TotalItems",
                                PublishedItems: "$PublishedItems",
                                MarkAddedItems: "$MarkAddedItems",
                                PublishedPercentage: {
                                    $round: {
                                        $multiply: [
                                            {
                                                $divide: ['$PublishedItems', {
                                                    $cond: {
                                                        if: { $eq: ["$TotalItems", 0] },
                                                        then: 1,
                                                        else: "$TotalItems"
                                                    }
                                                }]
                                            }, 100
                                        ]
                                    }
                                },
                                MarkAddedPercentage: {
                                    $round: {
                                        $multiply: [
                                            {
                                                $divide: ['$MarkAddedItems', {
                                                    $cond: {
                                                        if: { $eq: ["$TotalItems", 0] },
                                                        then: 1,
                                                        else: "$TotalItems"
                                                    }
                                                }]
                                            }, 100
                                        ]
                                    }
                                }
                            }
                        },
                        TotalItems: { $sum: "$TotalItems" },
                        PublishedItems: { $sum: "$PublishedItems" },
                        MarkAddedItems: { $sum: "$MarkAddedItems" }
                    }
                },
                {
                    $project: {
                        _id: 1, counts: 1, TotalItems: 1, PublishedItems: 1, MarkAddedItems: 1,
                        PublishedPercentage: {
                            $round: {
                                $multiply: [
                                    {
                                        $divide: ['$PublishedItems', {
                                            $cond: {
                                                if: { $eq: ["$TotalItems", 0] },
                                                then: 1,
                                                else: "$TotalItems"
                                            }
                                        }]
                                    }, 100
                                ]
                            }
                        },
                        MarkAddedPercentage: {
                            $round: {
                                $multiply: [
                                    {
                                        $divide: ['$MarkAddedItems', {
                                            $cond: {
                                                if: { $eq: ["$TotalItems", 0] },
                                                then: 1,
                                                else: "$TotalItems"
                                            }
                                        }]
                                    }, 100
                                ]
                            }
                        }
                    }
                }
            ]).toArray().then((result) => {

                resolve(result[0])
            })
        })
    },

    changeChooseItemsStatus: ({ EventId, GroupId, Status }) => {////*
        return new Promise(async (resolve, reject) => {

            if (Status == 'false') {
                db.get().collection(collection.GROUP_COLLECTION).updateOne({ EventId, GroupId }, {
                    $set: {
                        ChooseItem: true
                    }
                }).then(() => {
                    resolve({ Status: true })
                })

            } else {
                db.get().collection(collection.GROUP_COLLECTION).updateOne({ EventId, GroupId }, {
                    $set: {
                        ChooseItem: false
                    }
                }).then(() => {
                    resolve({ Status: false })
                })

            }
        })

    },

    findOneItemInCategory: (EventId, CategoryName) => { ////*

        return new Promise(async (resolve, reject) => {
            let allItemCategory = await db.get().collection(collection.ITEM_COLLECTION).find({ EventId, CategoryName })
                .project({ "Sub.Items": 0 }).toArray()
            resolve(allItemCategory[0])
        })
    },

    getAllItems: (EventId, Category, SubCategory) => { ////*

        return new Promise(async (resolve, reject) => {
            let getCategory = await db.get().collection(collection.ITEM_COLLECTION).findOne({ EventId, CategoryName: Category, "Sub.Title": SubCategory },
                { projection: { Sub: { $elemMatch: { Title: SubCategory } } } })


            resolve(getCategory.Sub[0])
        })

    },

    getAllItemsForGroup: (EventId, GroupId, Category, SubCategory) => {  ////*
        console.log(GroupId);
        return new Promise(async (resolve, reject) => {

            db.get().collection(collection.ITEM_COLLECTION).aggregate([
                { $match: { EventId, CategoryName: Category, "Sub.Title": SubCategory } },
                { $unwind: "$Sub" },
                { $match: { "Sub.Title": SubCategory } },
                { $unwind: "$Sub.Items" },
                {
                    $lookup: {
                        from: collection.STUDENTS_COLLECTION,
                        let: { groupId: "$GroupId", itemId: "$Sub.Items.ItemId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            // { $eq: ["$GroupId", "$$groupId"] },
                                            { $in: ["$$itemId", "$Items.ItemId"] }
                                        ]
                                    }
                                }
                            }
                        ],
                        as: 'students'
                    }
                },
                {
                    $project: {
                        Category: '$CategoryName', Type: 1,
                        SubCategory: '$Sub.Title',
                        Limit: '$Sub.Items.Limit',
                        Name: '$Sub.Items.Name',
                        CategoryName: '$Sub.Items.CategoryName',
                        Limit: '$Sub.Items.Limit',
                        ItemId: '$Sub.Items.ItemId',
                        _id: 0,
                        students: 1
                    }
                }
            ]).toArray().then((response) => {
                response = response.map((val) => {
                    return {
                        ...val,
                        StudentsCount: val.students.filter((one) => one.GroupId === GroupId).length
                    }
                })
                console.log(response);
                resolve(response)
            })

        })
    },

    addItem: (body, EventId, Category, SubCategory) => { ////*

        return new Promise(async (resolve, reject) => {

            body.ItemId = createRandomId(6, 'I')
            body.Limit = parseInt(body.Limit)
            body.ResultPublish = false
            body.MarkAdded = false

            await db.get().collection(collection.ITEM_COLLECTION).updateOne({ EventId, CategoryName: Category, "Sub.Title": SubCategory }, {
                $push: {
                    "Sub.$.Items": body
                },
                $inc: {
                    "Sub.$.Count": 1
                }
            }).then((result) => {
                db.get().collection(collection.POINT_CATEGORY_COLLECTION).updateOne({ EventId, CategoryName: body.CategoryName }, {
                    $inc: {
                        Count: 1
                    }
                }).then(() => {
                    resolve(EventId)
                })
            })
        })

    },

    getOneItemDetails: (EventId, Category, SubCategory, ItemId) => { ////*
        return new Promise(async (resolve, reject) => {

            await db.get().collection(collection.ITEM_COLLECTION).aggregate([
                { $match: { EventId, CategoryName: Category, "Sub.Title": SubCategory } },
                { $unwind: "$Sub" },
                { $match: { "Sub.Title": SubCategory } },
                { $unwind: "$Sub.Items" },
                { $match: { "Sub.Items.ItemId": ItemId } },
                { $replaceRoot: { newRoot: "$Sub.Items" } }
            ]).toArray().then((item) => {
                resolve(item[0])
            })
        });

    },

    editItemDetails: (EventId, Category, SubCategory, body) => { ////*
        return new Promise(async (resolve, reject) => {
            body.Limit = parseInt(body.Limit)
            await db.get().collection(collection.ITEM_COLLECTION).update({ EventId, CategoryName: Category, "Sub.Title": SubCategory, "Sub.Items.ItemId": body.ItemId },
                {
                    $set: {

                        "Sub.$[outer].Items.$[inner].Name": body.Name,
                        "Sub.$[outer].Items.$[inner].CategoryName": body.CategoryName,
                        "Sub.$[outer].Items.$[inner].Type": body.Type,
                        "Sub.$[outer].Items.$[inner].Limit": body.Limit,
                    }
                },
                {
                    arrayFilters: [
                        {
                            "outer.Title": SubCategory
                        },
                        {
                            "inner.ItemId": body.ItemId
                        }
                    ]
                }).then(() => {
                    db.get().collection(collection.POINT_CATEGORY_COLLECTION).updateOne({ EventId, CategoryName: body.CategoryName }, {
                        $inc: {
                            Count: 1
                        }
                    }).then(() => {
                        db.get().collection(collection.POINT_CATEGORY_COLLECTION).updateOne({ EventId, CategoryName: body.itemCategory }, {
                            $inc: {
                                Count: -1
                            }
                        }).then(() => {
                            resolve();
                        })
                    })
                })
        });

    },

    deleteItem: (EventId, Category, SubCategory, ItemId, itemCategory) => { ////*
        return new Promise(async (resolve, reject) => {
            let students = await db.get().collection(collection.STUDENTS_COLLECTION).findOne({ EventId, "Items.ItemId": ItemId })
            if (students) {
                resolve({ Error: 'Item was chosen by some students' })
            } else {
                await db.get().collection(collection.ITEM_COLLECTION).updateOne({
                    EventId, CategoryName: Category, Sub: {
                        $elemMatch: {
                            Title: SubCategory,
                            Items: {
                                $elemMatch: {
                                    ItemId
                                }
                            }
                        }
                    }
                }, {
                    $pull: {
                        "Sub.$.Items": {
                            ItemId
                        }
                    },
                    $inc: {
                        "Sub.$.Count": -1
                    }
                }).then(() => {
                    db.get().collection(collection.POINT_CATEGORY_COLLECTION).updateOne({ EventId, CategoryName: itemCategory }, {
                        $inc: {
                            Count: -1
                        }
                    })
                    resolve()
                })

            }
        })

    },

    getItemStudentsFromOneGroup: (EventId, GroupId, ItemId) => {////*
        return new Promise(async (resolve, reject) => {
            let Students = await db.get().collection(collection.STUDENTS_COLLECTION)
                .find({ EventId, GroupId, "Items.ItemId": ItemId }).toArray()
            resolve(Students)


        })
    },
    
    getItemStudentsFromAllGroup: (EventId, ItemId) => {////*
        return new Promise(async (resolve, reject) => {
            let Students = await db.get().collection(collection.STUDENTS_COLLECTION).aggregate([
                {
                    $match: {
                        EventId,
                        "Items.ItemId": ItemId
                    }
                },
                {
                    $lookup: {
                        from: collection.GROUP_COLLECTION,
                        localField: 'GroupId',
                        foreignField: "GroupId",
                        as: "GroupDetails"
                    }
                },
                {
                    $project: {
                        EventId: 1, GroupId: 1, Category: 1, ChestNo: 1, CicNo: 1, Name: 1,
                        GroupName: { $arrayElemAt: ['$GroupDetails.GroupName', 0] },
                        Item: {
                            $arrayElemAt: [{
                                $filter: {
                                    input: "$Items",
                                    as: 'items',
                                    cond: { $eq: ['$$items.ItemId', ItemId] }
                                }
                            }, 0
                            ]
                        }
                    }
                }
            ]).toArray()
            resolve(Students)


        })
    },

    addItemToStudent: (EventId, Category, SubCategory, body) => { ////*
        console.log(EventId, Category, SubCategory, body, 'body');
        return new Promise(async (resolve, reject) => {
            // Check valid Chest No
            const checkStudent = await db.get().collection(collection.STUDENTS_COLLECTION).findOne({ EventId, GroupId: body.GroupId, ChestNo: body.ChestNo })

            if (checkStudent) {
                // Student Chategory Check
                if (Category === 'GENERAL' || Category === checkStudent.Category) {
                    // Check Student Already choosed this Event
                    const checkAlreadyChoose = await db.get().collection(collection.STUDENTS_COLLECTION).findOne({
                        EventId, GroupId: body.GroupId, ChestNo: body.ChestNo,
                        "Items.ItemId": body.ItemId
                    }).then(async(checkAlreadyChoose) => {
                        if (checkAlreadyChoose) {
                            resolve({ Error: 'This item is already choosed' })
                        } else {
                            // Check Item Limit
                            let ItemLimit = await db.get().collection(collection.ITEM_COLLECTION).aggregate([
                                { $match: { EventId, CategoryName: Category, "Sub.Title": SubCategory } },
                                { $unwind: "$Sub" },
                                { $match: { "Sub.Title": SubCategory } },
                                { $unwind: "$Sub.Items" },
                                { $match: { "Sub.Items.ItemId": body.ItemId } },
                                { $replaceRoot: { newRoot: "$Sub.Items" } }
                            ]).toArray()
                            let AllStudentsInOneItem = await studentHelpers.getItemStudentsGroupBasis(EventId, body.GroupId, body.ItemId)
                            console.log(ItemLimit, AllStudentsInOneItem.length, 'hhh');
                            if (ItemLimit[0].Limit <= AllStudentsInOneItem.length) {
                                resolve({ Error: 'Item limit is over' })
                            } else {
                                let SubCategoryLimit = await eventHelpers.findOneItemInSubCategory(EventId, checkStudent.Category, SubCategory)
                                let studentEvents = await studentHelpers.getOneStudentItems(EventId, body.ChestNo)
                                let flag = false
                                if (Category === 'GENERAL' && SubCategoryLimit.GeneralLimit) {
                                    const newArray = studentEvents.Items.filter((obj, index) => {
                                        return obj.ItemCategory === Category && obj.ItemSubCategory === SubCategory
                                    })
                                    if (newArray.length >= SubCategoryLimit.GeneralLimit) {
                                        resolve({ Error: 'Student Item limit is Over' })
                                    } else {
                                        flag = true
                                    }
                                } else if (Category !== 'GENERAL' && SubCategoryLimit.GeneralLimit) {
                                    const newArray = studentEvents.Items.filter((obj, index) => {
                                        return obj.ItemCategory === Category && obj.ItemSubCategory === SubCategory
                                    })
                                    if (newArray.length >= SubCategoryLimit.Limit) {
                                        resolve({ Error: 'Student Item limit is Over' })
                                    } else {
                                        flag = true
                                    }
                                } else {
                                    const newArray = studentEvents.Items.filter((obj, index) => {
                                        return obj.ItemSubCategory === SubCategory
                                    })
                                    if (newArray.length >= SubCategoryLimit.Limit) {
                                        resolve({ Error: 'Student Item limit is Over' })
                                    } else {
                                        flag = true
                                    }
                                }
                                if (flag) {
                                    let obj = {
                                        ItemId: body.ItemId,
                                        Grade: null,
                                        Mark: 0,
                                        Place: null
                                    }

                                    await db.get().collection(collection.STUDENTS_COLLECTION).updateOne({ EventId, ChestNo: body.ChestNo }, {
                                        $push: {
                                            Items: obj
                                        }
                                    }).then(() => {
                                        resolve({ Success: "Item added for student" })
                                    })
                                }

                            }

                        }
                    })
                } else {
                    resolve({ Error: 'Invalid Chest No' })
                }
            } else {
                resolve({ Error: "Invalid chest no" })
            }
        })
    },
}