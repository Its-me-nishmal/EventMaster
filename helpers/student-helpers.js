const db = require('../config/db')
const collection = require('../config/collections')

module.exports = {
    totalStudentsCount: (EventId) => { ////*
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.STUDENTS_COLLECTION).find({ EventId }).toArray().then((students) => {
                let obj = {
                    total: 0,
                    unItem: 0
                }
                obj.total = students.length
                let unItem = students.filter((student, index) => student.Items.length === 0)
                obj.unItem = unItem.length
                resolve(obj)
            })
        })

    },

    getAllStudentsInGroup: (EventId, GroupId, Category) => { ////*
        return new Promise(async (resolve, reject) => {
            let AllStudents = await db.get().collection(collection.STUDENTS_COLLECTION).find({ EventId, GroupId, Category }).toArray()
            resolve(AllStudents)
        })

    },

    createStudent: (EventId, GroupId, Category, body) => {  ////*

        return new Promise(async (resolve, reject) => {
            let CheckCICno = await db.get().collection(collection.STUDENTS_COLLECTION).findOne({ EventId, CicNo: body.CicNo })
            if (CheckCICno) {
                resolve({ cicNoError: true })
            } else {
                let CurrentSlNo = await db.get().collection(collection.GROUP_COLLECTION).findOne({ EventId, GroupId, "Category.CategoryName": Category }, {
                    projection: { GroupId: '$GroupId', Students_SlNo: '$Students_SlNo', SlNo: '$SlNo', Category: { $elemMatch: { CategoryName: Category } } }
                })
     
                GroupSlNo = CurrentSlNo.SlNo
                CurrentSlNo = CurrentSlNo.Students_SlNo
                CurrentSlNo = CurrentSlNo < 10 ? "0" + CurrentSlNo : CurrentSlNo

                const ChestNo = GroupSlNo + "" + CurrentSlNo

                const StudentDetails = {
                    EventId,
                    GroupId,
                    Category,
                    ChestNo,
                    CicNo: body.CicNo,
                    Name: body.Name,
                    Items: []
                }
                await db.get().collection(collection.STUDENTS_COLLECTION).insertOne(StudentDetails).then(() => {
                    db.get().collection(collection.GROUP_COLLECTION).updateOne({ EventId, GroupId, "Category.CategoryName": Category }, {
                        $inc: {
                            "Students_SlNo": 1,
                            "Category.$.StudentsCount": 1
                        }
                    }).then(() => {
                        resolve()
                    })
                })
            }
        })
    },

    removeStudent: (EventId, GroupId, ChestNo, Category) => {////*
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.STUDENTS_COLLECTION).deleteOne({ EventId, ChestNo }).then(() => {
                db.get().collection(collection.GROUP_COLLECTION).updateOne({ EventId, GroupId, "Category.CategoryName": Category }, {
                    $inc: {
                        "Category.$.StudentsCount": -1
                    }
                }).then(() => {
                    resolve()
                })
            })
        })

    },

    GroupBaiseStudentWithOutItems: (EventId, GroupId) => { ////*
     
        return new Promise((resolve, reject) => {
            db.get().collection(collection.STUDENTS_COLLECTION).find({ EventId, GroupId }).toArray().then((students) => {
         
                let unItem = students.filter((student) => student.Items.length === 0)

                resolve(unItem)
            })
        })
    },

    deleteStudentItem: (EventId, ChestNo, ItemId) => { ////*

        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.STUDENTS_COLLECTION).updateOne({ EventId, ChestNo }, {
                $pull: {
                    Items: {
                        ItemId
                    }
                }
            }).then(() => {
                resolve()
            })

        })

    },

    editStudentDetails: (EventId, ChestNo, body) => {  ////*

        return new Promise(async (resolve, reject) => {
            let CicNo = body.CicNo
            let checkCicNo = await db.get().collection(collection.STUDENTS_COLLECTION).findOne({ EventId, CicNo })

            if (checkCicNo) {
                resolve({ Error: 'This CIC No Already Used' })
            } else {
                db.get().collection(collection.STUDENTS_COLLECTION).updateOne({ EventId, ChestNo }, {
                    $set: {
                        CicNo: body.CicNo,
                        Name: body.Name
                    }
                }).then(() => {
                    resolve({ Success: 'Updated' })
                })
            }
        })

    },

    getOneStudentWithOutItem: (EventId, ChestNo) => { ////*
        return new Promise((resolve, reject) => {
            db.get().collection(collection.STUDENTS_COLLECTION).findOne({ EventId, ChestNo }, {
                projection: { Items: 0 }
            }).then((student) => {
                resolve(student)
            })
        })
    },

    getOneStudentItems: (EventId, ChestNo) => { ////*
        return new Promise(async (resolve, reject) => {
            let studentEvents = await db.get().collection(collection.STUDENTS_COLLECTION).aggregate([
                {
                    $match: {
                        EventId,
                        ChestNo
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
                    $project: {
                        _id: 0,
                        ItemDetails: 0

                    }
                }
            ]).toArray()
            resolve(studentEvents[0])
        })

    },

    addGroupCategoryLimit: (EventId, body) => {////*
       
        return new Promise(async (resolve, reject) => {
            for (const key in body) {
                db.get().collection(collection.ITEM_COLLECTION).updateOne({ EventId, CategoryName: body.CategoryName, 'Sub.Title': body[key][0] }, {
                    $set: {
                        "Sub.$.Limit": body[key][1] === '' ? 0 : Number(body[key][1]),
                        "Sub.$.GeneralLimit": body[key][2] === '' ? false : Number(body[key][2])
                    }
                })
            }
            resolve()
        })


    },

    getStudentOneItem: (EventId, ChestNo, ItemId) => {////*
        return new Promise((resolve, reject) => {
            db.get().collection(collection.STUDENTS_COLLECTION).findOne({ EventId, ChestNo, "Items.ItemId": ItemId },
                { projection: { Items: { $elemMatch: { ItemId } } } }).then((item) => {
                    resolve(item.Items[0])
                })
        })
    },

    getItemStudentsGroupBasis: (EventId, GroupId, ItemId) => {////
        return new Promise(async (resolve, reject) => {
            let Students = await db.get().collection(collection.STUDENTS_COLLECTION).find({ EventId, GroupId, "Items.ItemId": ItemId })
                .project({ Items: 0 }).toArray()
      
            resolve(Students)

        })

    },

    getAllStudentItems: (EventId) => { ////*
        return new Promise(async (resolve, reject) => {
            let studentEvents = await db.get().collection(collection.STUDENTS_COLLECTION).aggregate([
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
                    $project: {
                        _id: 0,
                        ItemDetails: 0

                    }
                }
            ]).toArray()
            resolve(studentEvents)
        })

    },

    changeAddStudentsStatus: ({ EventId, GroupId, Status }) => { ////*
        return new Promise(async (resolve, reject) => {

            if (Status == 'false') {
                db.get().collection(collection.GROUP_COLLECTION).updateOne({ EventId, GroupId }, {
                    $set: {
                        CreateStudent: true,
                        EditStudent: true
                    }
                }).then(() => {

                    resolve({ Status: true })
                })

            } else {
                db.get().collection(collection.GROUP_COLLECTION).updateOne({ EventId, GroupId }, {
                    $set: {
                        CreateStudent: false
                    }
                }).then(() => {


                    resolve({ Status: false })
                })

            }
        })

    },
    changeEditStudentsStatus: ({ EventId, GroupId, Status }) => { ////*
        return new Promise(async (resolve, reject) => {

            if (Status == 'false') {
                db.get().collection(collection.GROUP_COLLECTION).updateOne({ EventId, GroupId }, {
                    $set: {
                        EditStudent: true
                    }
                }).then(() => {
                    resolve({ Status: true })
                })

            } else {
                db.get().collection(collection.GROUP_COLLECTION).updateOne({ EventId, GroupId }, {
                    $set: {
                        EditStudent: false
                    }
                }).then(() => {
                    resolve({ Status: false })
                })

            }
        })

    },

    getAllStudentsWithOutPrograme: (EventId) => { ////*
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.STUDENTS_COLLECTION).find({ EventId }).toArray().then((students) => {

                let unItem = students.filter((student, index) => student.Items.length === 0)

                resolve(unItem)
            })
        })

    },

    searchStudent: (body) => { ////*
        return new Promise(async (resolve, reject) => {
            if (body.searchValue == "") {
                resolve(searchResult.empty = 0)
            } else {

                let searchValue = body.searchValue;
                await db.get().collection(collection.STUDENTS_COLLECTION).aggregate([
                    {
                        $match: {
                            EventId: body.EventId,
                            $or: [
                                {
                                    "Name": {
                                        $regex: new RegExp(searchValue, "i")
                                    }
                                },
                                {
                                    "CicNo": {
                                        $regex: new RegExp(searchValue, "i")
                                    }
                                },
                                {
                                    "ChestNo": {
                                        $regex: new RegExp(searchValue, "i")
                                    }
                                }
                            ]
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
                            _id: 0, GroupId: 1, Category: 1, ChestNo: 1, CicNo: 1, Name: 1,
                            GroupName: { $first: '$group.GroupName' }
                        }
                    }
                ]).toArray().then((result) => {
              
                    resolve(result)
                })

            }
        })

    },

}