const db = require('../config/db')
const collection = require('../config/collections')
const { createRandomId } = require('./function-helpers')

module.exports = {
    sendMessage: (EventId, GroupId, Subject, Content, Link = '', Type = '') => {////*
        return new Promise(async (resolve, reject) => {
            GroupId = GroupId === undefined ? null : GroupId
            let MessageId = createRandomId(10, "")

            let Message = {
                MessageId,
                Subject,
                Content,
                Link,
                Date: new Date(),
                Type: GroupId === null ? "Notifi_Group" : "Notifi_One",
                Read: false,
                View: false
            }
            if (Type === 'auto') {
                Message.Type = "Notfifi_Auto"
            }

            if (GroupId === null) {
                await db.get().collection(collection.GROUP_COLLECTION).updateMany({ EventId }, {
                    $push: {
                        Notifications: Message
                    }
                }).then(() => {
                    resolve({ Success: true })
                })
            } else {
                for (let i = 0; i < GroupId.length; i++) {
                    await db.get().collection(collection.GROUP_COLLECTION).updateOne({ EventId, GroupId: GroupId[i] }, {
                        $push: {
                            Notifications: Message
                        }
                    })
                }
                resolve({ Success: true })
            }
        })

    },

    getOneMessageWithOutGroupId: (EventId, MessageId) => {////*

        return new Promise(async (resolve, reject) => {
            let messages = await db.get().collection(collection.GROUP_COLLECTION).findOne({ EventId, 'Notifications.MessageId': MessageId },
                { projection: { _id: 0, Notifications: { $elemMatch: { MessageId } } } })
            messages = messages.Notifications[0]
            messages.Date = messages.Date.toLocaleString('en-US', { timeZone: "Asia/Kolkata" });
            resolve(messages)
        })

    },

    deleteNotificationFromAll: (EventId, MessageId) => {  ////*
        return new Promise((resolve, reject) => {
            db.get().collection(collection.GROUP_COLLECTION).updateMany({ EventId }, {
                $pull: {
                    Notifications: {
                        MessageId
                    }
                }
            }).then((response) => {
                resolve(response)
            })
        })

    },

    deleteNotificationFormOne: (EventId, GroupId, MessageId) => {  ////*
        return new Promise((resolve, reject) => {
            db.get().collection(collection.GROUP_COLLECTION).updateOne({ EventId, GroupId }, {
                $pull: {
                    Notifications: {
                        MessageId
                    }
                }
            }).then((response) => {
                resolve(response)
            })
        })

    },

    getNewNotificaionCount: (EventId, GroupId) => { ////*
        return new Promise(async (resolve, reject) => {
            let Notification = await db.get().collection(collection.GROUP_COLLECTION).findOne({ EventId, GroupId }, {
                projection: { Notifications: 1 }
            })
            let toFilter = Notification.Notifications.filter((value, index) => value.View === false)
            let count = toFilter.length
            if (count > 99) {
                count = "99+"
            } else if (count === 0) {
                count = null
            }
            resolve({ count })

        })

    },

    sawNotification: (body, EventId) => {  ////*
        console.log(body, EventId, 'hi');
        return new Promise((resolve, reject) => {
            db.get().collection(collection.GROUP_COLLECTION).updateOne({ EventId: EventId, GroupId: body.GroupId }, {
                $set: {
                    "Notifications.$[].View": true
                }
            }).then(() => {
                resolve()
            })

        })

    },

    readOneNotification: (body, EventId) => {////*
        console.log(body, EventId);
        return new Promise((resolve, reject) => {
            db.get().collection(collection.GROUP_COLLECTION).updateOne({
                EventId, GroupId: body.GroupId,
                Notifications: {
                    $elemMatch: {
                        MessageId: body.MessageId
                    }
                }
            }, {
                $set: {
                    "Notifications.$.Read": true
                }
            }).then((response) => {
                resolve(response)
            })
        })

    },

    clearOneNotification: (body, EventId) => {////*
        console.log(body, EventId);
        return new Promise((resolve, reject) => {
            db.get().collection(collection.GROUP_COLLECTION).updateOne({
                EventId, GroupId: body.GroupId
            }, {
                $pull: {
                    Notifications: {
                        MessageId: body.MessageId
                    }
                }
            }).then((response) => {
                resolve(response)
            }).catch((err) => {
                console.log(err);
            })
        })
    },

    readFullNotification: (body, EventId) => {////*
        return new Promise((resolve, reject) => {
            db.get().collection(collection.GROUP_COLLECTION).updateOne({ EventId, GroupId: body.GroupId }, {
                $set: {
                    "Notifications.$[].Read": true
                }
            }).then((response) => {
                resolve(response)
            })

        })

    },

    getOneMessage: (EventId, GroupId, MessageId) => {////*
        return new Promise(async (resolve, reject) => {
            let message = await db.get().collection(collection.GROUP_COLLECTION).findOne({ EventId, GroupId }, {
                projection: { Notifications: { $elemMatch: { MessageId } } }
            })
            message = message.Notifications?.[0]
            message.Date = message?.Date.toLocaleString('en-US', { timeZone: "Asia/Kolkata" });
            resolve(message)
        })

    },
}