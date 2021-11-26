var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
var ObjectId = require('mongodb').ObjectId;
const { response } = require('express');



module.exports = {

    forgotFestPassword: (body, FestId) => {
        return new Promise(async (resolve, reject) => {
            let response = []
            let fest = await db.get().collection(collection.FEST_COLLECTION).findOne({ FestId: body.FestId })
            if (fest === undefined || fest.FestId !== FestId) {

                resolve()


            } else {

                let Password = ""
                create_random_id(8)
                function create_random_id(sting_length) {
                    var randomString = '';
                    var numbers = 'ABCZXY'
                    for (var i, i = 0; i < sting_length; i++) {
                        randomString += numbers.charAt(Math.floor(Math.random() * numbers.length))
                    }
                    Password = randomString
                }
                let convertPassword = await bcrypt.hash(Password, 10)
                db.get().collection(collection.FEST_COLLECTION).updateOne({ FestId: body.FestId }, {
                    $set: {
                        Password: convertPassword
                    }
                }).then(() => {
                    resolve(Password)


                })
            }
        })

    },

    sessionOneStore: (sessionOneDetails) => {
        var FestId = sessionOneDetails.FestId
        var CreatedDate = new Date()

        sessionOneDetails.CreatedDate = CreatedDate
        sessionOneDetails.NumberGroups = parseInt(sessionOneDetails.NumberGroups)
        sessionOneDetails.NumberSessions = parseInt(sessionOneDetails.NumberSessions)
        sessionOneDetails.GroupSlNo = parseInt(0)

        var GroupCount = sessionOneDetails.NumberGroups

        let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let Year = parseInt(sessionOneDetails.FestDate.slice(0, 4))
        let Month = parseInt(sessionOneDetails.FestDate.slice(5, 7))
        let Day = parseInt(sessionOneDetails.FestDate.slice(8, 10))
            
        sessionOneDetails.FestDate = Day + " - " + monthNames[Month - 1] + " - " + Year

        return new Promise(async (resolve, reject) => {

            sessionOneDetails.Password = await bcrypt.hash(sessionOneDetails.Password, 10),

                db.get().collection(collection.FEST_COLLECTION).insertOne(sessionOneDetails).then((data) => {

                    resolve({ FestId, GroupCount })
                })
        })
    },

    sessionTwoStore: (sessionTwoDetails) => {
        var festId = sessionTwoDetails.FestId
        var inputDeatails = sessionTwoDetails


        var GroupName1 = inputDeatails.GroupName[0]
        var GroupName2 = inputDeatails.GroupName[1]
        var GroupName3 = inputDeatails.GroupName[2]
        var GroupName4 = inputDeatails.GroupName[3]
        var GroupName5 = inputDeatails.GroupName[4]
        var GroupName6 = inputDeatails.GroupName[5]


        return new Promise(async (resolve, reject) => {


            let NumberSessionsFest = await db.get().collection(collection.FEST_COLLECTION).findOne({ FestId: festId })
            let NumberSessionCount = NumberSessionsFest.NumberSessions


            if (!GroupName1 == "") {

                let obj1 = {
                    GroupName: GroupName1,
                    FestId: festId,
                    GroupId: "",
                    Convener: "",
                    Password: ""
                }

                db.get().collection(collection.GROUP_COLLECTION).insertOne(obj1).then((response) => {
                    resolve({ festId, NumberSessionCount })
                })

            }
            if (!GroupName2 == "") {

                let obj2 = {
                    GroupName: GroupName2,
                    FestId: festId,
                    GroupId: "",
                    Convener: "",
                    Password: ""
                }

                db.get().collection(collection.GROUP_COLLECTION).insertOne(obj2).then((response) => {
                    resolve()
                })

            }
            if (!GroupName3 == "") {

                let obj3 = {
                    GroupName: GroupName3,
                    FestId: festId,
                    GroupId: "",
                    Convener: "",
                    Password: ""
                }

                db.get().collection(collection.GROUP_COLLECTION).insertOne(obj3).then((response) => {
                    resolve()
                })

            }
            if (!GroupName4 == "") {

                let obj4 = {
                    GroupName: GroupName4,
                    FestId: festId,
                    GroupId: "",
                    Convener: "",
                    Password: ""
                }

                db.get().collection(collection.GROUP_COLLECTION).insertOne(obj4).then((response) => {
                    resolve()
                })

            }
            if (!GroupName5 == "") {

                let obj5 = {
                    GroupName: GroupName5,
                    FestId: festId,
                    GroupId: "",
                    Convener: "",
                    Password: ""
                }

                db.get().collection(collection.GROUP_COLLECTION).insertOne(obj5).then((response) => {
                    resolve()
                })

            }
            if (!GroupName6 == "") {

                let obj6 = {
                    GroupName: GroupName6,
                    FestId: festId,
                    GroupId: "",
                    Convener: "",
                    Password: ""
                }

                db.get().collection(collection.GROUP_COLLECTION).insertOne(obj6).then((response) => {
                    resolve()
                })

            }


        })

    },

    sessionThreeStore: (sessionThreeDetails) => {
        console.log(sessionThreeDetails);
        var FestId = sessionThreeDetails.FestId
        var sessionName = sessionThreeDetails.SessionName
        var status = sessionThreeDetails.Status
        var session = typeof sessionThreeDetails.SessionName
        var statusType = typeof status
        var sessionString = session === "string"
        var sessionLength = sessionName.length

        console.log(status);
        var session1 = sessionName[0]
        var session2 = sessionName[1]
        var session3 = sessionName[2]
        var session4 = sessionName[3]
        var session5 = sessionName[4]
        var session6 = sessionName[5]
        var status1 = status[0]
        var status2 = status[1]
        var status3 = status[2]
        var status4 = status[3]
        var status5 = status[4]
        var status6 = status[5]


        return new Promise(async (resolve, reject) => {

            if (sessionString) {
                var sessionItemObj = {
                    FestId: FestId,
                    SessionName: sessionName,
                    Category1: "Stage",
                    StageItem: [],
                    Category2: "Off Stage",
                    OffstageItem: [],
                    StageCount: parseInt(0),
                    OffStageCount: parseInt(0),

                }

                await db.get().collection(collection.GROUP_COLLECTION).update({ FestId: FestId }, {
                    $set: {
                        Session1: {
                            SessionName: sessionName,
                            Students_SlNo: parseInt(1),
                            StudentsCount: parseInt(0),
                            status: status
                        }
                    }
                }).then((response) => {
                    db.get().collection(collection.ITEM_COLLECTION).insertOne(sessionItemObj).then((resopnse) => {
                        resolve(FestId)
                    })
                })


            } else if (sessionLength === 2) {
                if (statusType === "string") {
                    db.get().collection(collection.GROUP_COLLECTION).updateMany({ FestId: FestId }, {
                        $set: {
                            Session1: {
                                SessionName: session1,
                                Students_SlNo: parseInt(1),
                                StudentsCount: parseInt(0),
                                status: status

                            },
                            Session2: {
                                SessionName: session2,
                                Students_SlNo: parseInt(1),
                                StudentsCount: parseInt(0),
                                status: null
                            }

                        }
                    }).then((response) => {

                        db.get().collection(collection.ITEM_COLLECTION).insertMany([{
                            FestId: FestId,
                            SessionName: session1,
                            Category1: "Stage",
                            StageItem: [],
                            Category2: "Off Stage",
                            OffstageItem: [],
                            StageCount: parseInt(0),
                            OffStageCount: parseInt(0),
                        }, {
                            FestId: FestId,
                            SessionName: session2,
                            Category1: "Stage",
                            StageItem: [],
                            Category2: "Off Stage",
                            OffstageItem: [],
                            StageCount: parseInt(0),
                            OffStageCount: parseInt(0),
                        }]).then((resoponse) => {
                            resolve(FestId)
                        })
                    })
                } else {
                    db.get().collection(collection.GROUP_COLLECTION).updateMany({ FestId: FestId }, {
                        $set: {
                            Session1: {
                                SessionName: session1,
                                Students_SlNo: parseInt(1),
                                StudentsCount: parseInt(0),
                                status: status1

                            },
                            Session2: {
                                SessionName: session2,
                                Students_SlNo: parseInt(1),
                                StudentsCount: parseInt(0),
                                status: status2
                            }

                        }
                    }).then((response) => {

                        db.get().collection(collection.ITEM_COLLECTION).insertMany([{
                            FestId: FestId,
                            SessionName: session1,
                            Category1: "Stage",
                            StageItem: [],
                            Category2: "Off Stage",
                            OffstageItem: [],
                            StageCount: parseInt(0),
                            OffStageCount: parseInt(0),
                        }, {
                            FestId: FestId,
                            SessionName: session2,
                            Category1: "Stage",
                            StageItem: [],
                            Category2: "Off Stage",
                            OffstageItem: [],
                            StageCount: parseInt(0),
                            OffStageCount: parseInt(0),
                        }]).then((resoponse) => {
                            resolve(FestId)
                        })
                    })
                }

            } else if (sessionLength === 3) {
                db.get().collection(collection.GROUP_COLLECTION).updateMany({ FestId: FestId }, {
                    $set: {
                        Session1: {
                            SessionName: session1,
                            Students_SlNo: parseInt(1),
                            StudentsCount: parseInt(0),
                            status: status1

                        },
                        Session2: {
                            SessionName: session2,
                            Students_SlNo: parseInt(1),
                            StudentsCount: parseInt(0),
                            status: status2
                        },
                        Session3: {
                            SessionName: session3,
                            Students_SlNo: parseInt(1),
                            StudentsCount: parseInt(0),
                            status: status3
                        }
                    }
                }).then((response) => {
                    db.get().collection(collection.ITEM_COLLECTION).insertMany([{
                        FestId: FestId,
                        SessionName: session1,
                        Category1: "Stage",
                        StageItem: [],
                        Category2: "Off Stage",
                        OffstageItem: [],
                        StageCount: parseInt(0),
                        OffStageCount: parseInt(0),
                    }, {
                        FestId: FestId,
                        SessionName: session2,
                        Category1: "Stage",
                        StageItem: [],
                        Category2: "Off Stage",
                        OffstageItem: [],
                        StageCount: parseInt(0),
                        OffStageCount: parseInt(0),
                    }, {
                        FestId: FestId,
                        SessionName: session3,
                        Category1: "Stage",
                        StageItem: [],
                        Category2: "Off Stage",
                        OffstageItem: [],
                        StageCount: parseInt(0),
                        OffStageCount: parseInt(0),
                    }
                    ]).then((resoponse) => {
                        resolve(FestId)
                    })
                })
            } else if (sessionLength === 4) {
                db.get().collection(collection.GROUP_COLLECTION).update({ FestId: FestId }, {
                    $set: {
                        Session1: {
                            SessionName: session1,
                            Students_SlNo: parseInt(1),
                            StudentsCount: parseInt(0),
                            status: status1

                        },
                        Session2: {
                            SessionName: session2,
                            Students_SlNo: parseInt(1),
                            StudentsCount: parseInt(0),
                            status: status2
                        },
                        Session3: {
                            SessionName: session3,
                            Students_SlNo: parseInt(1),
                            StudentsCount: parseInt(0),
                            status: status3
                        },
                        Session4: {
                            SessionName: session4,
                            Students_SlNo: parseInt(1),
                            StudentsCount: parseInt(0),
                            status: status4
                        }
                    }
                }).then((response) => {
                    db.get().collection(collection.ITEM_COLLECTION).insertMany([{
                        FestId: FestId,
                        SessionName: session1,
                        Category1: "Stage",
                        StageItem: [],
                        Category2: "Off Stage",
                        OffstageItem: [],
                        StageCount: parseInt(0),
                        OffStageCount: parseInt(0),
                    }, {
                        FestId: FestId,
                        SessionName: session2,
                        Category1: "Stage",
                        StageItem: [],
                        Category2: "Off Stage",
                        OffstageItem: [],
                        StageCount: parseInt(0),
                        OffStageCount: parseInt(0),
                    }, {
                        FestId: FestId,
                        SessionName: session3,
                        Category1: "Stage",
                        StageItem: [],
                        Category2: "Off Stage",
                        OffstageItem: [],
                        StageCount: parseInt(0),
                        OffStageCount: parseInt(0),
                    }, {
                        FestId: FestId,
                        SessionName: session4,
                        Category1: "Stage",
                        StageItem: [],
                        Category2: "Off Stage",
                        OffstageItem: [],
                        StageCount: parseInt(0),
                        OffStageCount: parseInt(0),
                    }
                    ]).then((resoponse) => {
                        resolve(FestId)
                    })
                })
            } else if (sessionLength === 5) {
                db.get().collection(collection.GROUP_COLLECTION).update({ FestId: FestId }, {
                    $set: {
                        Session1: {
                            SessionName: session1,
                            Students_SlNo: parseInt(1),
                            StudentsCount: parseInt(0),
                            status: status1

                        },
                        Session2: {
                            SessionName: session2,
                            Students_SlNo: parseInt(1),
                            StudentsCount: parseInt(0),
                            status: status2
                        },
                        Session3: {
                            SessionName: session3,
                            Students_SlNo: parseInt(1),
                            StudentsCount: parseInt(0),
                            status: status3
                        },
                        Session4: {
                            SessionName: session4,
                            Students_SlNo: parseInt(1),
                            StudentsCount: parseInt(0),
                            status: status4
                        },
                        Session5: {
                            SessionName: session5,
                            Students: [],
                            Students_SlNo: parseInt(1),
                            StudentsCount: parseInt(0),
                            status: status5
                        }
                    }
                }).then((response) => {
                    db.get().collection(collection.ITEM_COLLECTION).insertMany([{
                        FestId: FestId,
                        SessionName: session1,
                        Category1: "Stage",
                        StageItem: [],
                        Category2: "Off Stage",
                        OffstageItem: [],
                        StageCount: parseInt(0),
                        OffStageCount: parseInt(0),
                    }, {
                        FestId: FestId,
                        SessionName: session2,
                        Category1: "Stage",
                        StageItem: [],
                        Category2: "Off Stage",
                        OffstageItem: [],
                        StageCount: parseInt(0),
                        OffStageCount: parseInt(0),
                    }, {
                        FestId: FestId,
                        SessionName: session3,
                        Category1: "Stage",
                        StageItem: [],
                        Category2: "Off Stage",
                        OffstageItem: [],
                        StageCount: parseInt(0),
                        OffStageCount: parseInt(0),
                    }, {
                        FestId: FestId,
                        SessionName: session4,
                        Category1: "Stage",
                        StageItem: [],
                        Category2: "Off Stage",
                        OffstageItem: [],
                        StageCount: parseInt(0),
                        OffStageCount: parseInt(0),
                    }, {
                        FestId: FestId,
                        SessionName: session5,
                        Category1: "Stage",
                        StageItem: [],
                        Category2: "Off Stage",
                        OffstageItem: [],
                        StageCount: parseInt(0),
                        OffStageCount: parseInt(0),
                    }
                    ]).then((resoponse) => {
                        resolve(FestId)
                    })
                })
            } else if (sessionLength === 6) {
                db.get().collection(collection.GROUP_COLLECTION).update({ FestId: FestId }, {
                    $set: {
                        Session1: {
                            SessionName: session1,
                            Students_SlNo: parseInt(1),
                            StudentsCount: parseInt(0),
                            status: status1

                        },
                        Session2: {
                            SessionName: session2,
                            Students_SlNo: parseInt(1),
                            StudentsCount: parseInt(0),
                            status: status2
                        },
                        Session3: {
                            SessionName: session3,
                            Students_SlNo: parseInt(1),
                            StudentsCount: parseInt(0),
                            status: status3
                        },
                        Session4: {
                            SessionName: session4,
                            Students_SlNo: parseInt(1),
                            StudentsCount: parseInt(0),
                            status: status4
                        },
                        Session5: {
                            SessionName: session5,
                            Students_SlNo: parseInt(1),
                            StudentsCount: parseInt(0),
                            status: status5
                        },
                        Session6: {
                            SessionName: session6,
                            Students_SlNo: parseInt(1),
                            StudentsCount: parseInt(0),
                            status: status6
                        }
                    }
                }).then((response) => {
                    db.get().collection(collection.ITEM_COLLECTION).insertMany([{
                        FestId: FestId,
                        SessionName: session1,
                        Category1: "Stage",
                        StageItem: [],
                        Category2: "Off Stage",
                        OffstageItem: [],
                        StageCount: parseInt(0),
                        OffStageCount: parseInt(0),
                    }, {
                        FestId: FestId,
                        SessionName: session2,
                        Category1: "Stage",
                        StageItem: [],
                        Category2: "Off Stage",
                        OffstageItem: [],
                        StageCount: parseInt(0),
                        OffStageCount: parseInt(0),
                    }, {
                        FestId: FestId,
                        SessionName: session3,
                        Category1: "Stage",
                        StageItem: [],
                        Category2: "Off Stage",
                        OffstageItem: [],
                        StageCount: parseInt(0),
                        OffStageCount: parseInt(0),
                    }, {
                        FestId: FestId,
                        SessionName: session4,
                        Category1: "Stage",
                        StageItem: [],
                        Category2: "Off Stage",
                        OffstageItem: [],
                        StageCount: parseInt(0),
                        OffStageCount: parseInt(0),
                    }, {
                        FestId: FestId,
                        SessionName: session5,
                        Category1: "Stage",
                        StageItem: [],
                        Category2: "Off Stage",
                        OffstageItem: [],
                        StageCount: parseInt(0),
                        OffStageCount: parseInt(0),
                    }, {
                        FestId: FestId,
                        SessionName: session6,
                        Category1: "Stage",
                        StageItem: [],
                        Category2: "Off Stage",
                        OffstageItem: [],
                        StageCount: parseInt(0),
                        OffStageCount: parseInt(0),
                    }
                    ]).then((resoponse) => {
                        resolve(FestId)
                    })
                })
            }
        })
    },

    latestFest: (newDate) => {
        var CurrentYear = newDate.getFullYear();
        var CurrentYearString = CurrentYear.toString()
        var LetestFest = []
        return new Promise(async (resolve, reject) => {
            let Lestest4Fest = await db.get().collection(collection.FEST_COLLECTION).find({ FestDate: { $regex: CurrentYearString } }).sort({ CreatedDate: -1 }).limit(4).toArray()

            var first = Lestest4Fest[0]

            if (first === undefined) {

                resolve(LetestFest.Lestest4FestZero = true)
            } else {
                resolve(Lestest4Fest)

            }

        })
    },

    allFests: () => {
        return new Promise(async (resolve, reject) => {
            var fests = []
            let allFest = await db.get().collection(collection.FEST_COLLECTION).find().sort({ CreatedDate: -1 }).toArray()

            var first = allFest[0]

            if (first === undefined) {

                resolve(fests.allFestZero = true)
            } else {
                resolve(allFest)


            }
        })
    },

    FestLogin: (festId, body) => {

        var Password = body.Password
        var responses = {}
        return new Promise(async (resolve, reject) => {
            let fest = await db.get().collection(collection.FEST_COLLECTION).findOne({ FestId: festId })

            if (fest) {

                bcrypt.compare(Password, fest.Password).then((response) => {
                    if (response) {

                        responses.festDetails = fest,

                            responses.FestPasswordErr = false
                        resolve(responses)
                    } else {
                        resolve({ FestPasswordErr: true })

                    }
                })
            }
        })
    },
    addPointCategory: (categoryDetails) => {

        let newFestId = categoryDetails.FestId
        let response = []
        return new Promise(async (resolve, reject) => {

            let checkFestId = await db.get().collection(collection.POINT_CATEGORY_COLLECTION).find({ FestId: newFestId }).toArray()
            let itemWant = null;
            checkFestId.forEach((item) => {
                if (item.categoryName === categoryDetails.CategoryName) {
                    itemWant = item;
                }
            });

            if (itemWant == null) {
                db.get().collection(collection.POINT_CATEGORY_COLLECTION).insertOne({
                    FestId: categoryDetails.FestId,
                    categoryName: categoryDetails.CategoryName,
                    places: {
                        One: parseInt(categoryDetails.P1),
                        Two: parseInt(categoryDetails.P2),
                        Three: parseInt(categoryDetails.P3)
                    },
                    grades: {
                        A: parseInt(categoryDetails.A),
                        B: parseInt(categoryDetails.B),
                        C: parseInt(categoryDetails.C)
                    }

                }).then((response) => {
                    resolve(categoryDetails.FestId)
                })
            } else {
                resolve(response.categoryNameErr = true)
            }



        })

    },

    getPointCategory: (FestId) => {
        return new Promise(async (resolve, reject) => {
            let allPointCategory = []
            let getallPointCategory = await db.get().collection(collection.POINT_CATEGORY_COLLECTION).find({ FestId: FestId }).toArray()

            var result = getallPointCategory[0]

            if (result === undefined) {
                resolve(allPointCategory.categoryNull = true)
            } else {
                resolve(getallPointCategory)
            }
        })

    },

    deletePointCategory: (FestId, categoryName) => {

        return new Promise(async (resolve, reject) => {

            let eventStage = await db.get().collection(collection.ITEM_COLLECTION).findOne({ FestId, "StageItem.PointCategoryName": categoryName })
            let eventOffStage = await db.get().collection(collection.ITEM_COLLECTION).findOne({ FestId, "OffstageItem.PointCategoryName": categoryName })

            if (eventStage) {
                resolve({ event: true })
            } else if (eventOffStage) {
                resolve({ event: true })
            } else {
                db.get().collection(collection.POINT_CATEGORY_COLLECTION).deleteOne({ FestId: FestId, categoryName: categoryName }).then((result) => {
                    resolve()
                })
            }

        })


    },

    getAllItemCategory: (FestId) => {

        return new Promise(async (resolve, reject) => {
            let allItemCategory = await db.get().collection(collection.ITEM_COLLECTION).find({ FestId: FestId }).toArray()
            resolve(allItemCategory)
        })

    },

    getPointCategoryOptions: (FestId) => {
        return new Promise(async (resolve, reject) => {
            var PointOptions = await db.get().collection(collection.POINT_CATEGORY_COLLECTION).find({ FestId: FestId }).toArray()
            if (PointOptions) {
                resolve(PointOptions)
            }
        });


    },

    addEvent: (body, FestId, SessionName, CategoryName) => {

        create_random_id(5)
        function create_random_id(sting_length) {
            var randomString = '';
            var numbers = '123456789ABCDEFGHIJKLM'
            for (var i, i = 0; i < sting_length; i++) {
                randomString += numbers.charAt(Math.floor(Math.random() * numbers.length))
            }

            body.EventId = "E" + randomString


        }
        return new Promise(async (resolve, reject) => {

            var StageFind = await db.get().collection(collection.ITEM_COLLECTION).findOne({ FestId, SessionName, Category1: CategoryName })
            var OffStageFind = await db.get().collection(collection.ITEM_COLLECTION).findOne({ FestId, SessionName, Category2: CategoryName })


            if (StageFind == undefined) {

                db.get().collection(collection.ITEM_COLLECTION).updateOne({ FestId, SessionName, Category2: CategoryName }, {
                    $push: {
                        OffstageItem: {
                            EventName: body.EventName,
                            EventId: body.EventId,
                            PointCategoryName: body.PointCategoryName,
                            TypeOfEvent: body.TypeOfEvent,
                            EventLimit: parseInt(body.EventLimit),

                        }
                    },
                    $set: {
                        OffStageCount: OffStageFind.OffStageCount + 1
                    }
                }).then((result) => {
                    resolve(FestId)
                })
            } else {
                db.get().collection(collection.ITEM_COLLECTION).updateOne({ FestId, SessionName, Category1: CategoryName }, {
                    $push: {
                        StageItem: {
                            EventName: body.EventName,
                            EventId: body.EventId,
                            PointCategoryName: body.PointCategoryName,
                            TypeOfEvent: body.TypeOfEvent,
                            EventLimit: parseInt(body.EventLimit),

                        }
                    },
                    $set: {
                        StageCount: StageFind.StageCount + 1
                    }
                }).then((result) => {
                    resolve(FestId)
                })
            }


        })

    },

    getAllEvents: (FestDetails) => {

        return new Promise(async (resolve, reject) => {
            let getSession = await db.get().collection(collection.ITEM_COLLECTION).findOne({ FestId: FestDetails.FestId, SessionName: FestDetails.Session })

            if (FestDetails.Category == getSession.Category1) {
                var StageEvents = getSession.StageItem
                resolve(StageEvents.reverse())
            } else if (FestDetails.Category == getSession.Category2) {
                var OffStageEvents = getSession.OffstageItem
                resolve(OffStageEvents.reverse())
            }
            resolve()
        })

    },

    deleteEvent: (FestId, SessionName, CategoryName, EventId) => {

        return new Promise(async (resolve, reject) => {

            let Stage = await db.get().collection(collection.STUDENTS_COLLECTION).find({ FestId, SessionName, "StageEvents.EventId": EventId }).toArray()
            let OffStage = await db.get().collection(collection.STUDENTS_COLLECTION).find({ FestId, SessionName, "OffStageEvents.EventId": EventId }).toArray()
            if (Stage[0]) {
                resolve({ EventDeleteError: true })
            } else if (OffStage[0]) {
                resolve({ EventDeleteError: true })
            } else {
                var StageFind = await db.get().collection(collection.ITEM_COLLECTION).findOne({ FestId, SessionName, Category1: CategoryName })
                var OffStageFind = await db.get().collection(collection.ITEM_COLLECTION).findOne({ FestId, SessionName, Category2: CategoryName })

                if (CategoryName === "Stage") {
                    db.get().collection(collection.ITEM_COLLECTION).update({ FestId, SessionName }, {
                        $pull: {
                            StageItem: { EventId }
                        },
                        $set: {
                            StageCount: StageFind.StageCount - 1
                        }
                    }).then((response) => {

                        resolve()
                    })

                } else if (CategoryName === "Off Stage") {
                    db.get().collection(collection.ITEM_COLLECTION).update({ FestId, SessionName }, {
                        $pull: {
                            OffstageItem: { EventId }
                        },
                        $set: {
                            OffStageCount: OffStageFind.OffStageCount - 1
                        }
                    }).then((response) => {

                        resolve()
                    })
                }
            }



        })

    },

    getAllGroups: (FestId) => {
        return new Promise(async (resolve, reject) => {
            let allGroups = await db.get().collection(collection.GROUP_COLLECTION).find({ FestId }).toArray()
            resolve(allGroups)
        })
    },

    ActivateGroup: (FestId, GroupName, body) => {


        return new Promise(async (resolve, reject) => {

            create_random_id(5)
            function create_random_id(sting_length) {
                var randomString = '';
                var numbers = '123456789'
                for (var i, i = 0; i < sting_length; i++) {
                    randomString += numbers.charAt(Math.floor(Math.random() * numbers.length))
                }
                body.GroupId = "G" + randomString
            }
            create_random_id1(10)
            function create_random_id1(sting_length) {
                var randomString1 = '';
                var numbers = '1234567ABChwgkxyz!@#$%&*+=?/><'
                for (var i, i = 0; i < sting_length; i++) {
                    randomString1 += numbers.charAt(Math.floor(Math.random() * numbers.length))
                }
                body.PasswordFor = randomString1
            }
            body.Password = await bcrypt.hash(body.PasswordFor, 10)

            let Fest = await db.get().collection(collection.FEST_COLLECTION).findOne({ FestId })

            var SlNo = Fest.GroupSlNo + 1

            await db.get().collection(collection.FEST_COLLECTION).updateOne({ FestId }, {
                $set: {
                    GroupSlNo: SlNo
                }
            }).then((response) => {
                let Notification = {
                    FestId: FestId,
                    GroupId: body.GroupId,
                    Notifications: []
                }
                db.get().collection(collection.GROUP_COLLECTION).update({ FestId, GroupName }, {
                    $set: {
                        Convener: body.Convener,
                        GroupId: body.GroupId,
                        Password: body.Password,
                        PasswordFor: body.PasswordFor,
                        SlNo: SlNo,
                        SessionSlNo: parseInt(0)

                    }
                }).then((response) => {
                    db.get().collection(collection.NOTIFICATION_COLLECTION).insertOne(Notification).then(() => {
                        resolve()
                    })
                })

            })
        })

    },

    activateGroupSession: (body) => {

        return new Promise(async (resolve, reject) => {
            let Group = await db.get().collection(collection.GROUP_COLLECTION).findOne({ FestId: body.FestId, GroupId: body.GroupId })

            if (Group.Session1) {
                if (Group.Session1.SlNo === null || Group.Session1.SlNo === undefined) {
                    db.get().collection(collection.GROUP_COLLECTION).updateMany({ FestId: body.FestId, GroupId: body.GroupId },
                        [{
                            "$set": {
                                "Session1": {
                                    "$mergeObjects": [
                                        "$Session1",
                                        { SlNo: 1 }
                                    ]
                                }
                            }
                        }]
                    ).then((response) => {
                        if (Group.Session2) {
                            db.get().collection(collection.GROUP_COLLECTION).updateMany({ FestId: body.FestId, GroupId: body.GroupId },
                                [{
                                    "$set": {
                                        "Session2": {
                                            "$mergeObjects": [
                                                "$Session2",
                                                { SlNo: 2 }
                                            ]
                                        }
                                    }
                                }]
                            ).then((response) => {
                                if (Group.Session3) {
                                    db.get().collection(collection.GROUP_COLLECTION).updateMany({ FestId: body.FestId, GroupId: body.GroupId },
                                        [{
                                            "$set": {
                                                "Session3": {
                                                    "$mergeObjects": [
                                                        "$Session3",
                                                        { SlNo: 3 }
                                                    ]
                                                }
                                            }
                                        }]
                                    ).then((response) => {
                                        if (Group.Session4) {
                                            db.get().collection(collection.GROUP_COLLECTION).updateMany({ FestId: body.FestId, GroupId: body.GroupId },
                                                [{
                                                    "$set": {
                                                        "Session4": {
                                                            "$mergeObjects": [
                                                                "$Session4",
                                                                { SlNo: 4 }
                                                            ]
                                                        }
                                                    }
                                                }]
                                            ).then((response) => {
                                                if (Group.Session5) {
                                                    db.get().collection(collection.GROUP_COLLECTION).updateMany({ FestId: body.FestId, GroupId: body.GroupId },
                                                        [{
                                                            "$set": {
                                                                "Session5": {
                                                                    "$mergeObjects": [
                                                                        "$Session5",
                                                                        { SlNo: 5 }
                                                                    ]
                                                                }
                                                            }
                                                        }]
                                                    ).then((response) => {
                                                        if (Group.Session6) {
                                                            db.get().collection(collection.GROUP_COLLECTION).updateMany({ FestId: body.FestId, GroupId: body.GroupId },
                                                                [{
                                                                    "$set": {
                                                                        "Session6": {
                                                                            "$mergeObjects": [
                                                                                "$Session6",
                                                                                { SlNo: 6 }
                                                                            ]
                                                                        }
                                                                    }
                                                                }]
                                                            ).then((response) => {
                                                                resolve({ SlNoCreated: true })
                                                            })
                                                        } else {
                                                            resolve({ SlNoCreated: true })
                                                        }
                                                    })
                                                } else {
                                                    resolve({ SlNoCreated: true })
                                                }
                                            })
                                        } else {
                                            resolve({ SlNoCreated: true })
                                        }
                                    })
                                } else {
                                    resolve({ SlNoCreated: true })
                                }
                            })
                        } else {
                            resolve({ SlNoCreated: true })
                        }
                    })
                } else {
                    db.get().collection(collection.GROUP_COLLECTION).updateMany({ FestId: body.FestId, GroupId: body.GroupId },
                        [{
                            "$set": {
                                "Session1": {
                                    "$mergeObjects": [
                                        "$Session1",
                                        { SlNo: undefined }
                                    ]
                                }
                            }
                        }]
                    ).then((response) => {
                        if (Group.Session2) {
                            db.get().collection(collection.GROUP_COLLECTION).updateMany({ FestId: body.FestId, GroupId: body.GroupId },
                                [{
                                    "$set": {
                                        "Session2": {
                                            "$mergeObjects": [
                                                "$Session2",
                                                { SlNo: undefined }
                                            ]
                                        }
                                    }
                                }]
                            ).then((response) => {
                                if (Group.Session3) {
                                    db.get().collection(collection.GROUP_COLLECTION).updateMany({ FestId: body.FestId, GroupId: body.GroupId },
                                        [{
                                            "$set": {
                                                "Session3": {
                                                    "$mergeObjects": [
                                                        "$Session3",
                                                        { SlNo: undefined }
                                                    ]
                                                }
                                            }
                                        }]
                                    ).then((response) => {
                                        if (Group.Session4) {
                                            db.get().collection(collection.GROUP_COLLECTION).updateMany({ FestId: body.FestId, GroupId: body.GroupId },
                                                [{
                                                    "$set": {
                                                        "Session4": {
                                                            "$mergeObjects": [
                                                                "$Session4",
                                                                { SlNo: undefined }
                                                            ]
                                                        }
                                                    }
                                                }]
                                            ).then((response) => {
                                                if (Group.Session5) {
                                                    db.get().collection(collection.GROUP_COLLECTION).updateMany({ FestId: body.FestId, GroupId: body.GroupId },
                                                        [{
                                                            "$set": {
                                                                "Session5": {
                                                                    "$mergeObjects": [
                                                                        "$Session5",
                                                                        { SlNo: undefined }
                                                                    ]
                                                                }
                                                            }
                                                        }]
                                                    ).then((response) => {
                                                        if (Group.Session6) {
                                                            db.get().collection(collection.GROUP_COLLECTION).updateMany({ FestId: body.FestId, GroupId: body.GroupId },
                                                                [{
                                                                    "$set": {
                                                                        "Session6": {
                                                                            "$mergeObjects": [
                                                                                "$Session6",
                                                                                { SlNo: undefined }
                                                                            ]
                                                                        }
                                                                    }
                                                                }]
                                                            ).then((response) => {
                                                                resolve({ SlNoDeleted: true })
                                                            })
                                                        } else {
                                                            resolve({ SlNoDeleted: true })
                                                        }
                                                    })
                                                } else {
                                                    resolve({ SlNoDeleted: true })
                                                }
                                            })
                                        } else {
                                            resolve({ SlNoDeleted: true })
                                        }
                                    })
                                } else {
                                    resolve({ SlNoDeleted: true })
                                }
                            })
                        } else {
                            resolve({ SlNoDeleted: true })
                        }
                    })
                }
            }
        })
    },

    TimeOnOffStudents: (body) => {
        return new Promise(async (resolve, reject) => {

            let Group = await db.get().collection(collection.GROUP_COLLECTION).findOne({ FestId: body.FestId, GroupId: body.GroupId })
            let MessageId = ''
            let MessageDate = new Date()
            let year = MessageDate.getFullYear();
            let month = MessageDate.getMonth() + 1;
            let dt = MessageDate.getDate();
            if (dt < 10) {
                dt = '0' + dt;
            }
            if (month < 10) {
                month = '0' + month;
            }
            MessageDate = MessageDate.toLocaleString('en-US', { timeZone: "Asia/Kolkata" });
            let onlyDate = dt + "-" + month + "-" + year
            // var time = MessageDate.toLocaleTimeString();

            // MessageDate = onlyDate + ", " + time

            create_random_id(10) 
            function create_random_id(sting_length) {
                var randomString = '';
                var numbers = '123456789qwertyuipasdfghjklzxcvbnmMNBVCXZLKJHGFDSAPIUYTREWQ'
                for (var i, i = 0; i < sting_length; i++) {
                    randomString += numbers.charAt(Math.floor(Math.random() * numbers.length))
                }
                MessageId = randomString
            }
            if (Group) {

                if (Group.StudentsTime === null || Group.StudentsTime === undefined) {

                    db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId: body.FestId, GroupId: body.GroupId }, {
                        $set: {
                            StudentsTime: 1,
                            editStudentStatus: 1
                        }
                    }).then((reposne) => {

                        db.get().collection(collection.NOTIFICATION_COLLECTION).updateOne({ FestId: body.FestId, GroupId: body.GroupId }, {
                            $push: {
                                Notifications: {
                                    MessageId: MessageId,
                                    Header: "New student creation time has begun",
                                    Message: "The “Create Students” time starts on " + onlyDate,
                                    Link: "/group/students",
                                    MessageDate: MessageDate,
                                    Type: "Notific_Auto",
                                    Read: 1,
                                    View: 1
                                }
                            }
                        }).then((response) => {

                            resolve({ TimeOn: true })
                        })
                    })
                } else {


                    db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId: body.FestId, GroupId: body.GroupId }, {
                        $set: {
                            StudentsTime: undefined
                        }
                    }).then((reposne) => {
                        db.get().collection(collection.NOTIFICATION_COLLECTION).updateOne({ FestId: body.FestId, GroupId: body.GroupId }, {
                            $push: {
                                Notifications: {
                                    MessageId: MessageId,
                                    Header: "Student creation time end",
                                    Message: 'The "Create Students" time ends on ' + onlyDate,
                                    Link: "/group/students",
                                    MessageDate: MessageDate,
                                    Type: "Notific_Auto",
                                    Read: 1,
                                    View: 1
                                }
                            }
                        }).then((response) => {
                            resolve({ TimeOff: true })
                        })
                    })
                }
            }
        })

    },
    ShowEditOption: (body) => {
        return new Promise(async (resolve, reject) => {
            let Group = await db.get().collection(collection.GROUP_COLLECTION).findOne({ FestId: body.FestId, GroupId: body.GroupId })
            let MessageId = ''
            let MessageDate = new Date()
            let year = MessageDate.getFullYear();
            let month = MessageDate.getMonth() + 1;
            let dt = MessageDate.getDate();
            if (dt < 10) {
                dt = '0' + dt;
            }
            if (month < 10) {
                month = '0' + month;
            }
            let onlyDate = dt + "-" + month + "-" + year
            MessageDate = MessageDate.toLocaleString('en-US', { timeZone: "Asia/Kolkata" });
            // var time = MessageDate.toLocaleTimeString();

            // MessageDate = onlyDate + ", " + time

            create_random_id(10)
            function create_random_id(sting_length) {
                var randomString = '';
                var numbers = '123456789qwertyuipasdfghjklzxcvbnmMNBVCXZLKJHGFDSAPIUYTREWQ'
                for (var i, i = 0; i < sting_length; i++) {
                    randomString += numbers.charAt(Math.floor(Math.random() * numbers.length))
                }
                MessageId = randomString
            }
            if (Group) {

                if (Group.editStudentStatus === null || Group.editStudentStatus === undefined) {

                    db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId: body.FestId, GroupId: body.GroupId }, {
                        $set: {

                            editStudentStatus: 1
                        }
                    }).then((reposne) => {
                        db.get().collection(collection.NOTIFICATION_COLLECTION).updateOne({ FestId: body.FestId, GroupId: body.GroupId }, {
                            $push: {
                                Notifications: {
                                    MessageId: MessageId,
                                    Header: "Edit students option enabled",
                                    Message: 'The "Edit student" option enabled on ' + onlyDate,
                                    Link: "/group/students",
                                    MessageDate: MessageDate,
                                    Type: "Notific_Auto",
                                    Read: 1,
                                    View: 1
                                }
                            }
                        }).then((response) => {

                            resolve({ optionShow: true })
                        })
                    })
                } else {


                    db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId: body.FestId, GroupId: body.GroupId }, {
                        $set: {
                            editStudentStatus: undefined
                        }
                    }).then((reposne) => {
                        db.get().collection(collection.NOTIFICATION_COLLECTION).updateOne({ FestId: body.FestId, GroupId: body.GroupId }, {
                            $push: {
                                Notifications: {
                                    MessageId: MessageId,
                                    Header: "Edit student option disabled",
                                    Message: 'The "Edit student" option disabled on ' + onlyDate,
                                    Link: "/group/students",
                                    MessageDate: MessageDate,
                                    Type: "Notific_Auto",
                                    Read: 1,
                                    View: 1
                                }
                            }
                        }).then((response) => {

                            resolve({ optionHide: true })
                        })
                    })
                }
            }
        })

    },

    TimeOnOffEvents: (body) => {
        return new Promise(async (resolve, reject) => {
            let Group = await db.get().collection(collection.GROUP_COLLECTION).findOne({ FestId: body.FestId, GroupId: body.GroupId })
            let MessageId = ''
            let MessageDate = new Date()
            let year = MessageDate.getFullYear();
            let month = MessageDate.getMonth() + 1;
            let dt = MessageDate.getDate();
            if (dt < 10) {
                dt = '0' + dt;
            }
            if (month < 10) {
                month = '0' + month;
            }
            let onlyDate = dt + "-" + month + "-" + year
            MessageDate = MessageDate.toLocaleString('en-US', { timeZone: "Asia/Kolkata" });
            // var time = MessageDate.toLocaleTimeString();

            // MessageDate = onlyDate + ", " + time
            
            create_random_id(10)
            function create_random_id(sting_length) {
                var randomString = '';
                var numbers = '123456789qwertyuipasdfghjklzxcvbnmMNBVCXZLKJHGFDSAPIUYTREWQ'
                for (var i, i = 0; i < sting_length; i++) {
                    randomString += numbers.charAt(Math.floor(Math.random() * numbers.length))
                }
                MessageId = randomString
            }
            if (Group) {
                if (Group.EventsTime === null || Group.EventsTime === undefined) {

                    db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId: body.FestId, GroupId: body.GroupId }, {
                        $set: {
                            EventsTime: 1
                        }
                    }).then((reposne) => {
                        db.get().collection(collection.NOTIFICATION_COLLECTION).updateOne({ FestId: body.FestId, GroupId: body.GroupId }, {
                            $push: {
                                Notifications: {
                                    MessageId: MessageId,
                                    Header: "Event creation time started",
                                    Message: "Event creation time for new students will begin on " + onlyDate,
                                    Link: "/group/events",
                                    MessageDate: MessageDate,
                                    Type: "Notific_Auto",
                                    Read: 1,
                                    View: 1
                                }
                            }
                        }).then((response) => {
                            resolve({ TimeOn: true })
                        })

                    })
                } else {


                    db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId: body.FestId, GroupId: body.GroupId }, {
                        $set: {
                            EventsTime: undefined
                        }
                    }).then((reposne) => {
                        db.get().collection(collection.NOTIFICATION_COLLECTION).updateOne({ FestId: body.FestId, GroupId: body.GroupId }, {
                            $push: {
                                Notifications: {
                                    MessageId: MessageId,
                                    Header: "Event creation time over",
                                    Message: "Event creation time over on " + onlyDate,
                                    Link: "/group/events",
                                    MessageDate: MessageDate,
                                    Type: "Notific_Auto",
                                    Read: 1,
                                    View: 1
                                }
                            }
                        }).then((response) => {

                            resolve({ TimeOff: true })
                        })
                    })
                }
            }
        })

    },

    addEventsQuantity: (FestId, body) => {
        return new Promise(async (resolve, reject) => {

            // db.get().collection(collection.STUDENTS_COLLECTION).updateMany({ FestId: FestId, SessionName: body.SessionName }, {
            //     $set: {

            //         StageEventCount: parseInt(body.StageEventCount),
            //         OffStageEventCount: parseInt(body.OffStageEventCount),
            //         GeneralStageEventCount: parseInt(body.GeneralStageEventCount),
            //         GeneralOffStageEventCount: parseInt(body.GeneralOffStageEventCount)
            //     }
            // }).then(async (resoponse) => {

            let Fest = await db.get().collection(collection.GROUP_COLLECTION).findOne({ FestId: FestId })

            if (Fest.Session1.SessionName == body.SessionName) {
                db.get().collection(collection.GROUP_COLLECTION).updateMany({ FestId: FestId }, [
                    {
                        "$set": {
                            "Session1": {
                                "$mergeObjects": [
                                    "$Session1",
                                    {
                                        StageEventCount: parseInt(body.StageEventCount),
                                        OffStageEventCount: parseInt(body.OffStageEventCount),
                                        GeneralStageEventCount: parseInt(body.GeneralStageEventCount),
                                        GeneralOffStageEventCount: parseInt(body.GeneralOffStageEventCount)
                                    }
                                ]
                            }
                        }
                    }
                ]).then(() => {

                    resolve()
                })
            } else if (Fest.Session2.SessionName == body.SessionName) {
                db.get().collection(collection.GROUP_COLLECTION).updateMany({ FestId: FestId }, [
                    {
                        "$set": {
                            "Session2": {
                                "$mergeObjects": [
                                    "$Session2",
                                    {
                                        StageEventCount: parseInt(body.StageEventCount),
                                        OffStageEventCount: parseInt(body.OffStageEventCount),
                                        GeneralStageEventCount: parseInt(body.GeneralStageEventCount),
                                        GeneralOffStageEventCount: parseInt(body.GeneralOffStageEventCount)
                                    }
                                ]
                            }
                        }
                    }
                ]).then(() => {

                    resolve()
                })
            } else if (Fest.Session3.SessionName == body.SessionName) {
                db.get().collection(collection.GROUP_COLLECTION).updateMany({ FestId: FestId }, [
                    {
                        "$set": {
                            "Session3": {
                                "$mergeObjects": [
                                    "$Session3",
                                    {
                                        StageEventCount: parseInt(body.StageEventCount),
                                        OffStageEventCount: parseInt(body.OffStageEventCount),
                                        GeneralStageEventCount: parseInt(body.GeneralStageEventCount),
                                        GeneralOffStageEventCount: parseInt(body.GeneralOffStageEventCount)
                                    }
                                ]
                            }
                        }
                    }
                ]).then(() => {

                    resolve()
                })
            } else if (Fest.Session4.SessionName == body.SessionName) {
                db.get().collection(collection.GROUP_COLLECTION).updateMany({ FestId: FestId }, [
                    {
                        "$set": {
                            "Session4": {
                                "$mergeObjects": [
                                    "$Session4",
                                    {
                                        StageEventCount: parseInt(body.StageEventCount),
                                        OffStageEventCount: parseInt(body.OffStageEventCount),
                                        GeneralStageEventCount: parseInt(body.GeneralStageEventCount),
                                        GeneralOffStageEventCount: parseInt(body.GeneralOffStageEventCount)
                                    }
                                ]
                            }
                        }
                    }
                ]).then(() => {

                    resolve()
                })
            } else if (Fest.Session5.SessionName == body.SessionName) {
                db.get().collection(collection.GROUP_COLLECTION).updateMany({ FestId: FestId }, [
                    {
                        "$set": {
                            "Session5": {
                                "$mergeObjects": [
                                    "$Session5",
                                    {
                                        StageEventCount: parseInt(body.StageEventCount),
                                        OffStageEventCount: parseInt(body.OffStageEventCount),
                                        GeneralStageEventCount: parseInt(body.GeneralStageEventCount),
                                        GeneralOffStageEventCount: parseInt(body.GeneralOffStageEventCount)
                                    }
                                ]
                            }
                        }
                    }
                ]).then(() => {

                    resolve()
                })
            } else if (Fest.Session6.SessionName == body.SessionName) {
                db.get().collection(collection.GROUP_COLLECTION).updateMany({ FestId: FestId }, [
                    {
                        "$set": {
                            "Session6": {
                                "$mergeObjects": [
                                    "$Session6",
                                    {
                                        StageEventCount: parseInt(body.StageEventCount),
                                        OffStageEventCount: parseInt(body.OffStageEventCount),
                                        GeneralStageEventCount: parseInt(body.GeneralStageEventCount),
                                        GeneralOffStageEventCount: parseInt(body.GeneralOffStageEventCount)
                                    }
                                ]
                            }
                        }
                    }
                ]).then(() => {

                    resolve()
                })
            }
        })

        // })

    },

    getFestDetails: (FestId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.FEST_COLLECTION).findOne({ FestId: FestId }).then((response) => {
                resolve(response)
            })
        })

    },

    editFestDetails: (body) => {

        return new Promise((resolve, reject) => {
            let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            let Year = parseInt(body.FestDate.slice(0, 4))
            let Month = parseInt(body.FestDate.slice(5, 7))
            let Day = parseInt(body.FestDate.slice(8, 10))
                
            body.FestDate = Day + " - " + monthNames[Month - 1] + " - " + Year
            db.get().collection(collection.FEST_COLLECTION).updateOne({ FestId: body.FestId }, {
                $set: {
                    FestName: body.FestName,
                    FestDate: body.FestDate,
                    FestConvener: body.FestConvener,
                    NumberGroups: parseInt(body.NumberGroups),
                    NumberSessions: parseInt(body.NumberSessions)
                }
            }).then(() => {
                resolve()
            })
        })

    },

    changePassword: (body) => {

        return new Promise(async (resolve, reject) => {
            let Fest = await db.get().collection(collection.FEST_COLLECTION).findOne({ FestId: body.FestId })

            if (Fest) {
                bcrypt.compare(body.Password, Fest.Password).then(async (status) => {

                    if (status) {

                        passwordNew = await bcrypt.hash(body.NewPassword, 10)

                        db.get().collection(collection.FEST_COLLECTION).updateOne({ FestId: body.FestId },
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

    getGroupDetailsWithName: (FestId, GroupName) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.GROUP_COLLECTION).findOne({ FestId, GroupName }).then((response) => {
                resolve(response)
            })
        })

    },

    editGroupDetails: (FestId, body) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.GROUP_COLLECTION).updateMany({ FestId, GroupId: body.GroupId }, {
                $set: {
                    GroupName: body.GroupName,
                    Convener: body.Convener
                }
            }).then((response) => {
                resolve(response)

            })
        })
    },

    deleteGroup: (FestId, GroupName) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.GROUP_COLLECTION).deleteOne({ FestId, GroupName }).then((response) => {
                resolve()
            })
        })

    },

    deleteFest: (FestId) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.STUDENTS_COLLECTION).deleteMany({ FestId })
            await db.get().collection(collection.POINT_CATEGORY_COLLECTION).deleteMany({ FestId })
            await db.get().collection(collection.SCHEDULES_COLLECTON).deleteMany({ FestId })
            await db.get().collection(collection.GROUP_COLLECTION).deleteMany({ FestId })
            await db.get().collection(collection.NOTIFICATION_COLLECTION).deleteMany({ FestId })
            await db.get().collection(collection.ITEM_COLLECTION).deleteMany({ FestId })
            await db.get().collection(collection.FEST_COLLECTION).deleteOne({ FestId }).then(() => {
                resolve()
            })
        })

    },

    getOneStudentEvents: (FestId, GroupId, SessionName, ChestNo) => {
        return new Promise(async (resolve, reject) => {
            let studentEvents = await db.get().collection(collection.STUDENTS_COLLECTION).findOne({ FestId, GroupId, ChestNo })
            let OtherMark = await db.get().collection(collection.OTHER_MARK_COLLECTION).find({ FestId, ChestNo }).toArray()
            studentEvents.OtherMark = []
            studentEvents.OtherMarkTotal = 0
            if (!studentEvents.StageEventsMark) {
                studentEvents.StageEventsMark = 0
            } else if (studentEvents.OffStageeventsMark) {
                studentEvents.OffStageEventsMark = 0
            }

            for (let i = 0; i < OtherMark.length; i++) {
                if (OtherMark[i].TotalMark) {
                    studentEvents.OtherMark.push(OtherMark[i])
                    studentEvents.OtherMarkTotal = studentEvents.OtherMarkTotal + parseInt(OtherMark[i].TotalMark)
                }
            }

            resolve(studentEvents)
            console.log(studentEvents);
        })

    },

    deleteStudentEvent: (FestId, GroupId, ChestNo, EventId, SessionName) => {

        return new Promise(async (resolve, reject) => {
            let stageCheck = await db.get().collection(collection.STUDENTS_COLLECTION).findOne({ FestId, GroupId, ChestNo, "StageEvents.EventId": EventId })
            if (stageCheck) {
                let a = ''
                for (let i = 0; i < stageCheck.StageEvents.length; i++) {
                    if (stageCheck.StageEvents[i].EventId === EventId) {
                        if (stageCheck.StageEvents[i].Mark === undefined || stageCheck.StageEvents[i].Mark === 0) {
                            a = true
                        }
                    }
                }
                if (a) {
                    db.get().collection(collection.STUDENTS_COLLECTION).update({ FestId, GroupId, ChestNo, "StageEvents.EventId": EventId }, {
                        $pull: {
                            StageEvents: {

                                EventId: EventId

                            }
                        }
                    }).then(() => {

                        resolve()

                    })
                } else {
                    resolve({ eventDeletError: true })
                }
            } else {
                let a = ''
                for (let i = 0; i < stageCheck.OffStageEvents.length; i++) {
                    if (stageCheck.OffStageEvents[i].EventId === EventId) {
                        if (stageCheck.OffStageEvents[i].Mark === undefined || stageCheck.OffStageEvents[i].Mark === 0) {
                            a = true
                        }
                    }
                }
                if (a) {
                    db.get().collection(collection.STUDENTS_COLLECTION).update({ FestId, GroupId, ChestNo, "OffStageEvents.EventId": EventId }, {
                        $pull: {
                            OffStageEvents: {

                                EventId: EventId

                            }
                        }
                    }).then(() => {

                        resolve()

                    })
                } else {
                    resolve({ eventDeletError: true })
                }
            }
        })

    },

    getStudentEventLimit: (FestId, GroupId, SessionName) => {
        return new Promise(async (resolve, reject) => {
            //    let Group = await db.get().collection(collection.GROUP_COLLECTION).findOne({FestId,GroupId}).toArray()
            let First = await db.get().collection(collection.GROUP_COLLECTION).findOne({ FestId, GroupId })

            let One = First.Session1.SessionName === SessionName
            if (One) {
                resolve(First.Session1)
            } else {
                let Two = First.Session2.SessionName === SessionName
                if (Two) {
                    resolve(First.Session2)
                } else {
                    let Three = First.Session3.SessionName === SessionName
                    if (Three) {
                        resolve(First.Session3)
                    } else {
                        let Four = First.Session4.SessionName === SessionName
                        if (Four) {
                            resolve(First.Session4)
                        } else {
                            let Five = First.Session5.SessionName === SessionName
                            if (Five) {
                                resolve(First.Session5)
                            } else {
                                let Six = First.Session6.SessionName === SessionName
                                if (Six) {
                                    resolve(First.Session6)
                                }
                            }
                        }
                    }
                }
            }
        })
    },

    getStudentEventCount: (FestId, ChestNo) => {
        return new Promise(async (resolve, reject) => {
            let Students = await db.get().collection(collection.STUDENTS_COLLECTION).findOne({ FestId, ChestNo })

            let StageCount = 0
            let OffStageCount = 0
            let GeneralStageCount = 0
            let GeneralOffStageCount = 0
            for (let i = 0; i < Students.StageEvents.length; i++) {
                if (Students.StageEvents[i].status === "NonGeneral") {
                    StageCount = StageCount + 1

                } else if (Students.StageEvents[i].status === "General") {
                    GeneralStageCount = GeneralStageCount + 1

                }
            }

            for (let i = 0; i < Students.OffStageEvents.length; i++) {
                if (Students.OffStageEvents[i].status === "NonGeneral") {
                    OffStageCount = OffStageCount + 1

                } else if (Students.OffStageEvents[i].status === "General") {
                    GeneralOffStageCount = GeneralOffStageCount + 1

                }
            }

            resolve({
                StageCount, OffStageCount, GeneralOffStageCount, GeneralStageCount
            })
        })

    },

    getStudentsinEvent: (FestId, GroupId, EventId) => {
        return new Promise(async (resolve, reject) => {
            let Stage = await db.get().collection(collection.STUDENTS_COLLECTION).find({ FestId, GroupId, "StageEvents.EventId": EventId }).toArray()
            let OffStage = await db.get().collection(collection.STUDENTS_COLLECTION).find({ FestId, GroupId, "OffStageEvents.EventId": EventId }).toArray()
            if (Stage[0]) {
                resolve(Stage)
            } else if (OffStage[0]) {
                resolve(OffStage)
            } else {
                resolve()
            }
        })

    },

    getEventStudentsForAllGroup: (FestId, SessionName, CategoryName, EventId) => {
        return new Promise(async (resolve, reject) => {
            let Stage = await db.get().collection(collection.STUDENTS_COLLECTION).find({ FestId, "StageEvents.EventId": EventId }).toArray()
            let OffStage = await db.get().collection(collection.STUDENTS_COLLECTION).find({ FestId, "OffStageEvents.EventId": EventId }).toArray()
            if (Stage[0]) {
                resolve(Stage)
            } else if (OffStage[0]) {
                resolve(OffStage)
            } else {
                resolve()
            }

        })
    },
    getEventStudentsForAllGroupwithOnlythisEvent: (FestId, SessionName, CategoryName, EventId) => {
        return new Promise(async (resolve, reject) => {
            let Stage = await db.get().collection(collection.STUDENTS_COLLECTION).find({ FestId, "StageEvents.EventId": EventId }).toArray()
            let OffStage = await db.get().collection(collection.STUDENTS_COLLECTION).find({ FestId, "OffStageEvents.EventId": EventId }).toArray()
            if (Stage[0]) {
                for (let i = 0; i < Stage.length; i++) {
                    let a = {}
                    a.FestId = Stage[i].FestId
                    a.GroupId = Stage[i].GroupId
                    a.SessionName = Stage[i].SessionName
                    a.ChestNo = Stage[i].ChestNo
                    a.event = {}
                    for (let b = 0; b < Stage[i].StageEvents.length; b++) {
                        if (Stage[i].StageEvents[b].EventId === EventId) {
                            a.event = Stage[i].StageEvents[b]
                            if (Stage[i].StageEvents[b].Grade === "A") {
                                a.event.A = "Grade"
                            } else if (Stage[i].StageEvents[b].Grade === "B") {
                                a.event.B = "Grade"
                            } else if (Stage[i].StageEvents[b].Grade === "C") {
                                a.event.C = "Grade"
                            } else if (Stage[i].StageEvents[b].Grade === "") {
                                a.event.D = "Grade"
                            }
                            if (Stage[i].StageEvents[b].Place === "1st") {
                                a.event.One = "Place"
                            } else if (Stage[i].StageEvents[b].Place === "2nd") {
                                a.event.Two = "Place"
                            } else if (Stage[i].StageEvents[b].Place === "3rd") {
                                a.event.Three = "Place"
                            } else if (Stage[i].StageEvents[b].Place === "") {
                                a.event.four = "Place"
                            }

                        }
                    }
                    Stage[i] = a

                }
                resolve(Stage)
            } else if (OffStage[0]) {
                for (let i = 0; i < OffStage.length; i++) {
                    let a = {}
                    a.FestId = OffStage[i].FestId
                    a.GroupId = OffStage[i].GroupId
                    a.SessionName = OffStage[i].SessionName
                    a.ChestNo = OffStage[i].ChestNo
                    a.event = {}
                    for (let b = 0; b < OffStage[i].OffStageEvents.length; b++) {
                        if (OffStage[i].OffStageEvents[b].EventId === EventId) {
                            a.event = OffStage[i].OffStageEvents[b]
                            if (OffStage[i].OffStageEvents[b].Grade === "A") {
                                a.event.A = "Grade"
                            } else if (OffStage[i].OffStageEvents[b].Grade === "B") {
                                a.event.B = "Grade"
                            } else if (OffStage[i].OffStageEvents[b].Grade === "C") {
                                a.event.C = "Grade"
                            } else if (OffStage[i].OffStageEvents[b].Grade === "") {
                                a.event.D = "Grade"
                            }
                            if (OffStage[i].OffStageEvents[b].Place === "1st") {
                                a.event.One = "Place"
                            } else if (OffStage[i].OffStageEvents[b].Place === "2nd") {
                                a.event.Two = "Place"
                            } else if (OffStage[i].OffStageEvents[b].Place === "3rd") {
                                a.event.Three = "Place"
                            } else if (OffStage[i].OffStageEvents[b].Place === "") {
                                a.event.four = "Place"
                            }

                        }
                    }
                    OffStage[i] = a

                }

                resolve(OffStage)
            } else {
                resolve()
            }

        })
    },

    activeUser: (body) => {
        return new Promise(async (resolve, reject) => {
            let fest = await db.get().collection(collection.FEST_COLLECTION).findOne({ FestId: body.FestId })
            if (fest) {
                if (fest.userStatus === null || fest.userStatus === undefined) {


                    db.get().collection(collection.FEST_COLLECTION).updateMany({}, {
                        $set: {
                            resultStatus: undefined,
                            userStatus: undefined
                        }
                    }).then(() => {

                        db.get().collection(collection.FEST_COLLECTION).updateOne({ FestId: body.FestId }, {
                            $set: {
                                userStatus: 1
                            }
                        })
                    })
                    resolve({ userStatusOn: true })

                } else {


                    db.get().collection(collection.FEST_COLLECTION).updateMany({ FestId: body.FestId }, {
                        $set: {
                            resultStatus: undefined,
                            userStatus: undefined
                        }
                    }).then(() => {
                        resolve({ userStatusOff: true })
                    })

                }
            }
        })

    },

    activeResult: (body) => {
        return new Promise(async (resolve, reject) => {
            let fest = await db.get().collection(collection.FEST_COLLECTION).findOne({ FestId: body.FestId })
            if (fest) {
                if (fest.resultStatus === null || fest.resultStatus === undefined) {
                    db.get().collection(collection.FEST_COLLECTION).updateMany({}, {
                        $set: {
                            resultStatus: undefined,
                            userStatus: undefined
                        }
                    }).then((reposne) => {
                        db.get().collection(collection.FEST_COLLECTION).updateOne({ FestId: body.FestId }, {
                            $set: {
                                resultStatus: 1,
                                userStatus: 1
                            }
                        })
                        resolve({ resultStatusOn: true })
                    })
                } else {
                    db.get().collection(collection.FEST_COLLECTION).updateOne({ FestId: body.FestId }, {
                        $set: {
                            resultStatus: undefined
                        }
                    }).then((reposne) => {
                        resolve({ resultStatusOff: true })
                    })
                }
            }
        })

    },

    getFestDetails: (FestId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.FEST_COLLECTION).findOne({ FestId }).then((fest) => {
                resolve(fest)
            })
        })

    },

    addProgramSchedule: (body, FestId) => {
        create_random_id(6)
        function create_random_id(sting_length) {
            var randomString = '';
            var numbers = 'abcdefghijklmnopqrstuvwxyz'
            for (var i, i = 0; i < sting_length; i++) {
                randomString += numbers.charAt(Math.floor(Math.random() * numbers.length))
            }
            ScheduleId = randomString
        }

        let Item = {
            Title: body.title,
            FestId: FestId,
            Sdl_Id: ScheduleId
        }


        return new Promise((resolve, reject) => {
            db.get().collection(collection.SCHEDULES_COLLECTON).insertOne(Item).then(() => {
                let MessageId = ''
                let MessageDate = new Date()
                let year = MessageDate.getFullYear();
                let month = MessageDate.getMonth() + 1;
                let dt = MessageDate.getDate();
                if (dt < 10) {
                    dt = '0' + dt;
                }
                if (month < 10) {
                    month = '0' + month;
                }
                let onlyDate = dt + "-" + month + "-" + year
                MessageDate = MessageDate.toLocaleString('en-US', { timeZone: "Asia/Kolkata" });
                // var time = MessageDate.toLocaleTimeString();

                // MessageDate = onlyDate + ", " + time

                create_random_id(10)
                function create_random_id(sting_length) {
                    var randomString = '';
                    var numbers = '123456789qwertyuipasdfghjklzxcvbnmMNBVCXZLKJHGFDSAPIUYTREWQ'
                    for (var i, i = 0; i < sting_length; i++) {
                        randomString += numbers.charAt(Math.floor(Math.random() * numbers.length))
                    }
                    MessageId = randomString
                }
                db.get().collection(collection.NOTIFICATION_COLLECTION).updateMany({ FestId }, {
                    $push: {
                        Notifications: {
                            MessageId: MessageId,
                            Header: "New file uploaded",
                            Message: "'" + body.title + "' file uploaded on " + onlyDate,
                            Link: "/group",
                            MessageDate: MessageDate,
                            Type: "Notific_Auto",
                            Read: 1,
                            View: 1
                        }
                    }
                }).then((response) => {
                    resolve()
                })
            })
        })

    },

    getAllProgramSchedules: (FestId) => {
        return new Promise(async (resolve, reject) => {
            let schedules = await db.get().collection(collection.SCHEDULES_COLLECTON).find({ FestId }).toArray()
            resolve(schedules)
        })

    },

    deleteProgramSchedule: (id, FestId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.SCHEDULES_COLLECTON).deleteOne({ Sdl_Id: id, FestId }).then(() => {
                resolve()
            })
        })

    },

    sendMessage: (body, FestId) => {
        return new Promise(async (resolve, reject) => {
            let MessageDate = new Date()
            let year = MessageDate.getFullYear();
            let month = MessageDate.getMonth() + 1;
            let dt = MessageDate.getDate();
            if (dt < 10) {
                dt = '0' + dt;
            }
            if (month < 10) {
                month = '0' + month;
            }
            var onlyDate = dt + "-" + month + "-" + year
            MessageDate = MessageDate.toLocaleString('en-US', { timeZone: "Asia/Kolkata" });
            // var time = MessageDate.toLocaleTimeString();

            // MessageDate = onlyDate + ", " + time

            create_random_id(10)
            function create_random_id(sting_length) {
                var randomString = '';
                var numbers = '123456789qwertyuipasdfghjklzxcvbnmMNBVCXZLKJHGFDSAPIUYTREWQ'
                for (var i, i = 0; i < sting_length; i++) {
                    randomString += numbers.charAt(Math.floor(Math.random() * numbers.length))
                }
                MessageId = randomString
            }

            if (body.GroupId === undefined) {
                //let Fest = await db.get().collection(collection.NOTIFICATION_COLLECTION).find({FestId}).toArray()
                db.get().collection(collection.NOTIFICATION_COLLECTION).updateMany({ FestId }, {
                    $push: {
                        Notifications: {
                            MessageId: MessageId,
                            Header: body.MessageHeader,
                            Message: body.Message,
                            Link: body.MessageLink,
                            MessageDate: MessageDate,
                            Type: "Notific_Full",
                            Read: 1,
                            View: 1

                        }
                    }
                }).then((response) => {
                    resolve(response)
                })

            } else if (typeof body.GroupId === "string") {
                db.get().collection(collection.NOTIFICATION_COLLECTION).updateOne({ FestId, GroupId: body.GroupId }, {
                    $push: {
                        Notifications: {
                            MessageId: MessageId,
                            Header: body.MessageHeader,
                            Message: body.Message,
                            Link: body.MessageLink,
                            MessageDate: MessageDate,
                            Type: "Notific_One",
                            Read: 1,
                            View: 1
                        }
                    }
                }).then((response) => {
                    resolve(response)
                })
            } else if (typeof body.GroupId === "object") {
                GroupIds = body.GroupId
                for (let i = 0; i < GroupIds.length; i++) {
                    let id = GroupIds[i]
                    db.get().collection(collection.NOTIFICATION_COLLECTION).updateOne({ FestId, GroupId: id }, {
                        $push: {
                            Notifications: {
                                MessageId: MessageId,
                                Header: body.MessageHeader,
                                Message: body.Message,
                                Link: body.MessageLink,
                                MessageDate: MessageDate,
                                Type: "Notific_One",
                                Read: 1,
                                View: 1
                            }
                        }
                    }).then((response) => {
                        resolve(response)
                    })
                }
            } else {
                resolve()

            }
        })

    },

    getCommenNotifications: (FestId) => {
        return new Promise(async (resolve, reject) => {
            let Notification = await db.get().collection(collection.NOTIFICATION_COLLECTION).findOne({ FestId })
            if (Notification === undefined) {
                resolve()
            } else {

                for (let i = 0; i < Notification.Notifications.length; i++) {
                    if (Notification.Notifications[i].Type === "Notific_Full") {
                        Notification.Notifications[i].Full = true
                    }
                    if (Notification.Notifications[i].Header.length > 50) {
                        Notification.Notifications[i].Header = Notification.Notifications[i].Header.slice(0, 50) + "..."
                    }
                }
                resolve(Notification)
            }
        })

    },

    deleteNotificationWithoutGroupId: (FestId, MessageId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.NOTIFICATION_COLLECTION).updateMany({ FestId: FestId }, {
                $pull: {
                    Notifications: {
                        MessageId: MessageId
                    }
                }
            }).then((response) => {
                resolve(response)
            })
        })

    },
    deleteNotification: (FestId, GroupId, MessageId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.NOTIFICATION_COLLECTION).updateOne({ FestId, GroupId }, {
                $pull: {
                    Notifications: {
                        MessageId: MessageId
                    }
                }
            }).then((response) => {
                resolve(response)
            })
        })

    },
    recoverNotification: (FestId, GroupId, MessageId) => {

        return new Promise((resolve, reject) => {
            db.get().collection(collection.NOTIFICATION_COLLECTION).updateOne({
                FestId, GroupId,
                Notifications: {
                    $elemMatch: {
                        MessageId: MessageId
                    }
                }
            }, {
                $set: {
                    "Notifications.$.Clear": null
                }
            }).then((response) => {
                resolve(response)
            })
        })

    },

    sessionActiveDetails: (FestId) => {
        return new Promise(async (resolve, reject) => {
            let groups = await db.get().collection(collection.GROUP_COLLECTION).find({ FestId }).toArray()
            let SessionDetails = []
            let pending = 0
            for (let i = 0; i < groups.length; i++) {
                if (groups[i].Session1.SlNo == null || groups[i].Session1.SlNo == undefined) {
                    pending = pending + 1
                    let Obj = {
                        GroupName: groups[i].GroupName
                    }
                    SessionDetails.push(Obj)
                } else {
                    let Obj = {
                        GroupName: groups[i].GroupName,
                        Session: true
                    }
                    SessionDetails.push(Obj)
                }
            }
            if (pending == 0) {
                resolve(SessionDetails)
            } else {
                SessionDetails.pending = pending
                resolve(SessionDetails)

            }
        })
    },

    StatusUserResult: (FestId) => {
        return new Promise(async (resolve, reject) => {
            let fest = await db.get().collection(collection.FEST_COLLECTION).findOne({ FestId })
            let status = {}
            if (fest.userStatus == null || fest.userStatus == undefined) {
            } else {
                status.user = true
            }
            if (fest.resultStatus == null || fest.resultStatus == undefined) {
            } else {
                status.result = true
            }
            resolve(status)
        })

    },

    totalStudentsDetails: (FestId) => {
        return new Promise(async (resolve, reject) => {
            let allStudents = await db.get().collection(collection.STUDENTS_COLLECTION).find({ FestId }).toArray()
            let response = {
                totalCount: 0,
                StudentwithoutProgram: [],
                StudnetWithOutCount: 0
            }
            response.totalCount = allStudents.length
            for (let i = 0; i < allStudents.length; i++) {
                if (allStudents[i].StageEvents.length == 0) {
                    if (allStudents[i].OffStageEvents.length == 0) {
                        let group = await db.get().collection(collection.GROUP_COLLECTION).findOne({ FestId, GroupId: allStudents[i].GroupId })
                        let Obj = {
                            GroupId: allStudents[i].GroupId,
                            GroupName: group.GroupName,
                            SessionName: allStudents[i].SessionName,
                            ChestNo: allStudents[i].ChestNo,
                            FullName: allStudents[i].FullName,
                            CicNo: allStudents[i].CicNo
                        }
                        response.StudentwithoutProgram.push(Obj)
                    }
                }

            }
            response.StudnetWithOutCount = response.StudentwithoutProgram.length

            resolve(response)
        })

    },

    changeFestStatus: (FestId) => {
        return new Promise(async (resolve, reject) => {
            let fest = await db.get().collection(collection.FEST_COLLECTION).findOne({ FestId })
            if (fest.festStatus == null || fest.festStatus == undefined) {
                db.get().collection(collection.FEST_COLLECTION).updateOne({ FestId }, {
                    $set: {
                        festStatus: 1
                    }
                }).then(() => {
                    resolve()
                })
            } else {
                db.get().collection(collection.FEST_COLLECTION).updateOne({ FestId }, {
                    $set: {
                        festStatus: null
                    }
                }).then(() => {
                    resolve()
                })
            }
        })

    },

    AlleventDetails: (FestId) => {
        return new Promise(async (resolve, reject) => {
            let events = await db.get().collection(collection.ITEM_COLLECTION).find({ FestId }).toArray()
            let result = {
                TotalEvents: 0,
                Published: 0,
                Pending: 0
            }
            for (let i = 0; i < events.length; i++) {
                result.TotalEvents = result.TotalEvents + events[i].StageCount + events[i].OffStageCount
                for (a = 0; a < events[i].StageItem.length; a++) {
                    if (events[i].StageItem[a].Result) {
                        result.Published = result.Published + 1
                    } else {
                        result.Pending = result.Pending + 1
                    }
                }
                for (a = 0; a < events[i].OffstageItem.length; a++) {
                    if (events[i].OffstageItem[a].Result) {
                        result.Published = result.Published + 1
                    } else {
                        result.Pending = result.Pending + 1
                    }
                }
            }
            resolve(result);
        })
    },

    groupSessionStatus: (FestId, GroupId) => {
        return new Promise(async (resolve, reject) => {
            if (GroupId) {
                let Group = await db.get().collection(collection.GROUP_COLLECTION).findOne({ FestId, GroupId })
                if (Group.Session1.SlNo == null || Group.Session1.SlNo == undefined) {
                    resolve()
                } else {
                    resolve({ status: true })
                }
            } else {
                resolve()
            }
        })

    }










}
