const db = require('../config/db')
const collection = require('../config/collections')
const itemHelpers = require('./item-helpers');

module.exports = {

    getItemStudentsFromAllGroup: (EventId, Category, SubCategory, ItemId) => {////+++
        return new Promise(async (resolve, reject) => {
            let ItemDetails = await itemHelpers.getOneItemDetails(EventId, Category, SubCategory, ItemId)
            let Students = []
            if (ItemDetails?.ResultPublish) {
                Students = await db.get().collection(collection.STUDENTS_COLLECTION).aggregate([
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
            } else {
                Students = await db.get().collection(collection.STUDENTS_COLLECTION).aggregate([
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
                            GroupName: { $arrayElemAt: ['$GroupDetails.GroupName', 0] }
                        }
                    }
                ]).toArray()
            }
            resolve(Students)


        })
    },

    getGroupItemMarksFromAllGroup: (EventId, Category, SubCategory, ItemId) => {////+++
        return new Promise(async (resolve, reject) => {
            let ItemDetails = await itemHelpers.getOneItemDetails(EventId, Category, SubCategory, ItemId)
            let result = []
            if (ItemDetails?.ResultPublish) {
                result = await db.get().collection(collection.GROUP_COLLECTION).aggregate([
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
                ]).toArray()
            } else {

                result = await db.get().collection(collection.GROUP_COLLECTION).aggregate([
                    {
                        $match: {
                            EventId
                        }
                    },
                    {
                        $project: {
                            EventId: 1, GroupName: 1, GroupId: 1
                        }
                    }
                ]).toArray()
            }
            resolve(result)
        })
    },
}