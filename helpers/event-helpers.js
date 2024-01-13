const db = require('../config/db')
const collection = require('../config/collections')
const bcrypt = require('bcrypt')
const { createRandomId } = require('./function-helpers')



module.exports = {

    // Create Event
    sessionOneStore: (data) => {   

        const EventId = createRandomId(7, data.Type === 'Fest' ? "F" : "S", 'number')

        data.CreatedDate = new Date()
        data.GroupsCount = Number(data.GroupsCount)
        data.CategoryCount = Number(data.CategoryCount)
        data.EventId = EventId
        data.Date = new Date(data.Date)
        data.BuildStage = 1
        data.Launch = false
        data.ResultPublish = false
        data.MarkStatus = false
        data.Files = []

        return new Promise(async (resolve, reject) => {
            data.Password = await bcrypt.hash(data.Password, 10)
            await db.get().collection(collection.EVENT_COLLECTION).insertOne(data).then(() => {
                resolve({ EventId, GroupsCount: data.GroupsCount })
            })
        })
    },

    sessionTwoStore: (data) => {   
        const EventId = data.EventId

        return new Promise(async (resolve, reject) => {
            let allGroup = []

            for (let i = 0; i < data.GroupName.length; i++) {
                let obj = {
                    GroupName: data.GroupName[i],
                    EventId: EventId,
                    GroupId: "",
                    Convener: "",
                    Password: "",
                    SlNo: i + 1,
                    Students_SlNo : 1,
                    GroupItems: [],
                    Notifications: []
                }
                allGroup.push(obj)
            }

            await db.get().collection(collection.GROUP_COLLECTION).insertMany(allGroup).then(async () => {
                await db.get().collection(collection.EVENT_COLLECTION).updateOne({ EventId }, {
                    $set: {
                        BuildStage: 2
                    }
                })
                const event = await db.get().collection(collection.EVENT_COLLECTION).findOne({ EventId: EventId })
                resolve({ EventId, CategoryCount: event.CategoryCount })
            }).catch((error) => {
            })
        })

    },

    sessionThreeStore: (data) => {    

        const EventId = data.EventId
        const CategoryName = typeof data.CategoryName === 'string' ? [data.CategoryName] : data.CategoryName
        const status = typeof data.Status === 'string' ? [data.Status] : data.Status

        return new Promise(async (resolve, reject) => {
            const event = await db.get().collection(collection.EVENT_COLLECTION).findOne({ EventId: EventId })
            let toGroupObj = []
            let toItemObj = []

            for (let i = 0; i < CategoryName.length; i++) {
                let obj2 = {
                    CategoryName: CategoryName[i],
                    Status: status[i],
                }
                let obj = {
                    EventId: EventId,
                    CategoryName: CategoryName[i],
                    Type: "Non General",
                    Sub: []
                }

                if (event.Type === "Sports") {
                    obj.Sub[0] = {
                        Title: 'Item',
                        Items: [],
                        Count: 0,
                    }
                } else {
                    obj.Sub[0] = {
                        Title: 'Stage',
                        Items: [],
                        Count: 0,
                    }
                    obj.Sub[1] = {
                        Title: 'Off Stage',
                        Items: [],
                        Count: 0,
                    }
                }
                if (status[i]) {
                    obj2 = {
                        ...obj2,
                        Students_SlNo: 1,
                        StudentsCount: 0,
                        SlNo: i + 1
                    }
                    if (event.Type === "Sports") {
                        obj.Sub[0] = {
                            ...obj.Sub[0],
                            Limit: 0,
                            GeneralLimit: false
                        }
                    } else {
                        obj.Sub[0] = {
                            ...obj.Sub[0],
                            Limit: 0,
                            GeneralLimit: false
                        }
                        obj.Sub[1] = {
                            ...obj.Sub[1],
                            Limit: 0,
                            GeneralLimit: false
                        }
                    }
                } else {
                    obj2 = {
                        ...obj2,
                        Status: false
                    }
                    obj = {
                        ...obj,
                        Type: false
                    }
                }
                toItemObj.push(obj)
                toGroupObj.push(obj2)

            }
            await db.get().collection(collection.GROUP_COLLECTION).update({ EventId: EventId }, {
                $set: {
                    Category: toGroupObj,
                }
            }).then((response) => {
                db.get().collection(collection.ITEM_COLLECTION).insertMany(toItemObj).then((resopnse) => {
                    db.get().collection(collection.EVENT_COLLECTION).updateOne({ EventId }, {
                        $set: {
                            BuildStage: 3
                        }
                    })
                    resolve(EventId)
                })
            })
        })
    },

    sessionFourStore: ({ EventId }) => {   
        return new Promise((resolve, reject) => {
            db.get().collection(collection.EVENT_COLLECTION).updateOne({ EventId }, {
                $set: {
                    BuildStage: null
                }
            }).then(() => {
                resolve()
            })
        })
    },

    // Dashboard
    getPointsCount: (EventId) => {  
        return new Promise(async (resolve, reject) => {
            let data = {}
            let Points = await db.get().collection(collection.POINT_CATEGORY_COLLECTION).find({ EventId }).toArray()
            if (Points[0]) {
                data.count = Points.length;
                data.not = false
            } else {
                data.count = 0;
                data.not = true
            }
            resolve(data)
        })

    },

    // Event
    allEvents: () => {   
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.EVENT_COLLECTION).find().sort({ CreatedDate: -1 })
                .toArray().then((allEvent) => {
                    resolve(allEvent)
                })
        })
    },

    EventLogin: ({ EventId, Password }) => {   
        let responses = {}
        return new Promise(async (resolve, reject) => {
            let event = await db.get().collection(collection.EVENT_COLLECTION).findOne({ EventId })

            if (event) {
                bcrypt.compare(Password, event.Password).then((response) => {
                    if (response) {
                        delete event.Password
                        responses.event = event
                        resolve(responses)
                    } else {
                        response.PasswordErr = true
                        resolve(response)
                    }
                })
            } else {
                response.EventIdErr = true
                resolve(response)
            }
        })
    },

    getEventDetails: (EventId) => {   
        return new Promise((resolve, reject) => {
            db.get().collection(collection.EVENT_COLLECTION).findOne({ EventId }, { projection: { Password: 0 } }).then((event) => {
                resolve(event)
            })
        })
    },

    // Points Category
    getPoints: (EventId) => {    
        return new Promise(async (resolve, reject) => {
            let Points = await db.get().collection(collection.POINT_CATEGORY_COLLECTION).find({ EventId }).toArray()
            if (!Points[0]) {
                Points = false
            }
            resolve(Points)
        })

    },

    addPoints: (data) => {  


        return new Promise(async (resolve, reject) => {


            const check = await db.get().collection(collection.POINT_CATEGORY_COLLECTION)
                .findOne({ EventId: data.EventId, CategoryName: data.CategoryName })

            if (!check) {
                db.get().collection(collection.POINT_CATEGORY_COLLECTION).insertOne({
                    EventId: data.EventId,
                    CategoryName: data.CategoryName,
                    Places: {
                        One: Number(data.P1),
                        Two: Number(data.P2),
                        Three: Number(data.P3)
                    },
                    Grades: {
                        A: Number(data.A),
                        B: Number(data.B),
                        C: Number(data.C)
                    },
                    Count: 0

                }).then((response) => {
                    resolve()
                })
            } else {
                resolve({ categoryNameErr: true })
            }
        })

    },

    deletePoint: (EventId, CategoryName) => {  

        return new Promise(async (resolve, reject) => {

            db.get().collection(collection.POINT_CATEGORY_COLLECTION).findOne({ EventId, CategoryName }).then((result) => {
                if (result?.Count > 0) {
                    resolve({ event: true })
                } else {
                    db.get().collection(collection.POINT_CATEGORY_COLLECTION).deleteOne({ EventId, CategoryName }).then(() => {
                        resolve()
                    })
                }
            })

        })
    },

    getAllItemCategoryWithItems: (EventId) => {  

        return new Promise(async (resolve, reject) => {
            let allItemCategory = await db.get().collection(collection.ITEM_COLLECTION).find({ EventId }).toArray()
            resolve(allItemCategory)
        })

    },

    findOneItemInSubCategory: (EventId, CategoryName, SubCategory) => {  

        return new Promise(async (resolve, reject) => {
            let allItemSubCategory = await db.get().collection(collection.ITEM_COLLECTION).find({ EventId, CategoryName, 'Sub.Title': SubCategory })
                .project({ Sub: { $elemMatch: { Title: SubCategory } } }).toArray()
            allItemSubCategory = allItemSubCategory[0].Sub[0]
            delete allItemSubCategory.Items
            resolve(allItemSubCategory)
        })
    },

    getPointCategoryOptions: (EventId) => {  
        return new Promise(async (resolve, reject) => {
            const PointOptions = await db.get().collection(collection.POINT_CATEGORY_COLLECTION).find({ EventId }).toArray()
            resolve(PointOptions)
        });
    },
    
    getOnePointDetails: (EventId, CategoryName) => { 
        return new Promise((resolve, reject) => {
            db.get().collection(collection.POINT_CATEGORY_COLLECTION).findOne({ EventId, CategoryName }).then((point) => {
                resolve(point)
            })
        })
    },

    editEventDetails: (body) => {  

        return new Promise((resolve, reject) => {
            body.Date = new Date(body.Date);
            db.get().collection(collection.EVENT_COLLECTION).updateOne({ EventId: body.EventId }, {
                $set: {
                    Name: body.Name,
                    Date: body.Date,
                    Convener: body.Convener,
                    Mobile: body.Mobile
                }
            }).then(() => {
                resolve()
            })
        })

    },

    changePassword: (body) => { 

        return new Promise(async (resolve, reject) => {
            let Event = await db.get().collection(collection.EVENT_COLLECTION).findOne({ EventId: body.EventId })

            if (Event) {
                bcrypt.compare(body.Password, Event.Password).then(async (status) => {

                    if (status) {

                        passwordNew = await bcrypt.hash(body.NewPassword, 10)

                        db.get().collection(collection.EVENT_COLLECTION).updateOne({ EventId: body.EventId },
                            {
                                $set: {
                                    Password: passwordNew
                                }
                            }).then((response) => {

                                resolve(passwordSuccess = true)

                            });

                    } else {
                        resolve()
                    }
                })
            }
        })

    },

    deleteEvent: (EventId) => { 
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.STUDENTS_COLLECTION).deleteMany({ EventId })
            await db.get().collection(collection.POINT_CATEGORY_COLLECTION).deleteMany({ EventId })
            await db.get().collection(collection.GROUP_COLLECTION).deleteMany({ EventId })
            await db.get().collection(collection.ITEM_COLLECTION).deleteMany({ EventId })
            await db.get().collection(collection.EVENT_COLLECTION).deleteOne({ EventId }).then(() => {
                resolve()
            })
        })

    },

    launchEvent: ({ EventId, Status }) => {  
        return new Promise(async (resolve, reject) => {
            if (Status === 'true') {
                db.get().collection(collection.EVENT_COLLECTION).updateOne({ EventId }, {
                    $set: {
                        Launch: false,
                        ResultPublish: false
                    }
                }).then(() => {
                    resolve({ Status: false })
                })
            } else {
                db.get().collection(collection.EVENT_COLLECTION).updateOne({ EventId }, {
                    $set: {
                        Launch: true
                    }
                }).then(() => {
                    resolve({ Status: true })
                })
            }
        })
    },

    publishResult: ({ EventId, Status }) => {   
        return new Promise(async (resolve, reject) => {
            if (Status === 'true') {
                db.get().collection(collection.EVENT_COLLECTION).updateOne({ EventId }, {
                    $set: {
                        ResultPublish: false
                    }
                }).then(() => {
                    resolve({ Status: false })
                })
            } else {
                db.get().collection(collection.EVENT_COLLECTION).updateOne({ EventId }, {
                    $set: {
                        ResultPublish: true,
                        Launch: true
                    }
                }).then(() => {
                    resolve({ Status: true })
                })
            }
        })

    },

    uploadFiles: (body, EventId) => { 
        return new Promise(async (resolve, reject) => {
            let Item = {
                Title: body.title,
                FileId: null
            }

            Item.FileId = createRandomId(6, "")

            await db.get().collection(collection.EVENT_COLLECTION).updateOne({ EventId }, {
                $push: {
                    Files: Item
                }
            }).then(() => {
                resolve({ FileId: Item.FileId })
            })
        })

    },

    getAllUploadedFiles: (EventId) => { 
        return new Promise(async (resolve, reject) => {
            let Files = await db.get().collection(collection.EVENT_COLLECTION).findOne({ EventId }, {
                projection: { Files: 1, EventId: 1, _id: 0 }
            })
            resolve(Files)
        })

    },

    deleteUploadFile: (FileId, EventId) => { 
        return new Promise((resolve, reject) => {
            db.get().collection(collection.EVENT_COLLECTION).updateOne({ EventId }, {
                $pull: {
                    Files: { FileId }
                }
            }).then(() => {
                resolve()
            })
        })

    },

    statusViewEvent: (EventId) => {  
        return new Promise(async (resolve, reject) => {
            let event = await db.get().collection(collection.EVENT_COLLECTION).findOne({ EventId })
            let status = {}
            if (event?.eventViewStatus) {
                status.user = true
            }
            if (event?.resultViewStatus) {
                status.result = true
            }
            resolve(status)
        })
    },

}
