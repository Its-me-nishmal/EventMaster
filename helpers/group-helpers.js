const db = require('../config/db')
const collection = require('../config/collections')
const bcrypt = require('bcrypt')
const { createRandomId } = require('./function-helpers')

module.exports = {
    doLogin: (body) => { 
        return new Promise(async (resolve, reject) => {

            let Group = await db.get().collection(collection.GROUP_COLLECTION).findOne({ GroupId: body.GroupId })
            if (Group) {
                bcrypt.compare(body.Password, Group.Password).then((status) => {
                    if (status) {
                        delete Group.Password
                        delete Group.Notifications
                        delete Group.GroupItems
                        delete Group.PasswordFor
                        delete Group.Category

                        resolve(Group)

                    } else {
                        resolve({ Error: "Incorrect password" })
                    }
                })
            } else {
                resolve({ Error: "Incorrect group id" })


            }
        })

    },

    getGroupDetails: (GroupId, EventId) => {  
        return new Promise((resolve, reject) => {
            db.get().collection(collection.GROUP_COLLECTION).findOne({ GroupId, EventId }).then((response) => {
                delete response?.Password
                delete response?.PasswordFor
                resolve(response)
            })
        })

    },

    editGroupDetails: (EventId, body) => {   
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.GROUP_COLLECTION).updateMany({ EventId, GroupId: body.GroupId }, {
                $set: {
                    GroupName: body.GroupName,
                    Convener: body.Convener
                }
            }).then((response) => {
                resolve(response)
            })
        })
    },

    changePassword: (body) => {  
        return new Promise(async (resolve, reject) => {
            let Group = await db.get().collection(collection.GROUP_COLLECTION).findOne({ EventId: body.EventId, GroupId: body.GroupId })
            bcrypt.compare(body.CurrentPassword, Group.Password).then(async (status) => {
                if (status) {

                    let passwordNew = await bcrypt.hash(body.NewPassword, 10)
                    db.get().collection(collection.GROUP_COLLECTION).updateOne({ EventId: body.EventId, GroupId: body.GroupId },
                        {
                            $set: {
                                Password: passwordNew,
                                PasswordFor: body.NewPassword
                            }
                        }).then(() => {
                            resolve({ passwordSuccess: true })
                        });
                } else {
                    resolve()
                }
            })
        })

    },

    // Notification
    getGroupNotifications: (EventId, GroupId) => {  
        return new Promise(async (resolve, reject) => {
            let Notifi = await db.get().collection(collection.GROUP_COLLECTION).findOne({ EventId, GroupId }, {
                projection: { _id: 0, Notifications: 1, GroupId: 1, GroupName: 1 }
            })
            for (let i = 0; i < Notifi.Notifications.length; i++) {
                if (Notifi.Notifications[i].Subject.length > 35) {
                    Notifi.Notifications[i].Subject = Notifi.Notifications[i].Subject.slice(0, 35) + "..."
                }
                if (Notifi.Notifications[i].Content.length > 140) {
                    Notifi.Notifications[i].Content = Notifi.Notifications[i].Content.slice(0, 140) + "..."
                }
                Notifi.Notifications[i].Date = Notifi.Notifications[i].Date.toLocaleString('en-US', { timeZone: "Asia/Kolkata" });
            }
            Notifi.Notifications.reverse()
            resolve(Notifi)
        })

    },

    isAllGroupActive: (EventId) => {  
        return new Promise(async (resolve, reject) => {
            try {
                let groups = await db.get().collection(collection.GROUP_COLLECTION).find({ EventId }).toArray()
                let flag = false
                for (let i = 0; i < groups.length; i++) {
                    if (groups[i].GroupId === "") {
                        flag = flag === false ? 1 : flag + 1;
                    }
                }
                resolve(flag)
            } catch (error) {

            }
        })
    },

    ActivateGroup: (EventId, GroupName, body) => {  
        return new Promise(async (resolve, reject) => {
            body.GroupId = createRandomId(5, "G", 'number')
            body.PasswordFor = createRandomId(10, "", 'symbol')
            body.Password = await bcrypt.hash(body.PasswordFor, 10)

            const Notification = {
                MessageId: createRandomId(10, ''),
                Subject: 'Welcome Note',
                Content: "Hi Convener, Your Group Account is Activated before just menuts.Please Read the Help & Info Page for understand about use this event website. Thank you",
                Link: '',
                Date: new Date(),
                Type: "Notifi_Auto",
                Read: false,
                View: false
            }
            db.get().collection(collection.GROUP_COLLECTION).update({ EventId, GroupName }, {
                $set: {
                    Convener: body.Convener,
                    GroupId: body.GroupId,
                    Password: body.Password,
                    PasswordFor: body.PasswordFor,
                    EditStudent: false,
                    CreateStudent: false,
                    ChooseItem: false,
                },
                $push: {
                    Notifications: Notification
                }
            }).then((response) => {
                resolve()
            })
        })

    },

    getAllGroups: (EventId) => {  
        return new Promise(async (resolve, reject) => {
            let allGroups = await db.get().collection(collection.GROUP_COLLECTION).find({ EventId }).toArray()
            resolve(allGroups)
        })
    },

    getAllGroupsGroupItem: (EventId) => {  
        return new Promise(async (resolve, reject) => {
            let studentEvents = await db.get().collection(collection.GROUP_COLLECTION).aggregate([
                {
                    $match: {
                        EventId
                    }
                },
                {
                    $lookup: {
                        from: collection.ITEM_COLLECTION,
                        let: { itemIds: '$GroupItems.ItemId' },
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
                                input: "$GroupItems",
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
                    $project: {
                        _id: 0,
                        ItemDetails: 0,
                        Password: 0, PasswordFor: 0, Category: 0, GroupItems: 0, SlNo: 0, Convener: 0

                    }
                }
            ]).toArray()
            resolve(studentEvents)
        })

    },

    fetchData: ({ GroupId }) => { 
        return new Promise((resolve, reject) => {
            db.get().collection(collection.GROUP_COLLECTION).findOne({ GroupId }).then((response) => {
                delete response.Password
                delete response.Notifications
                delete response.GroupItems
                delete response.PasswordFor
                delete response.Category
                resolve(response)
            })
        })

    },

}