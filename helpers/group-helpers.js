var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
const { reject, resolve, all } = require('promise')
const { response } = require('express')

module.exports = {
    doLogin: (body) => {
        return new Promise(async (resolve, reject) => {
            let response = []
            let GroupIdCheck = await db.get().collection(collection.GROUP_COLLECTION).findOne({ GroupId: body.GroupId })
            if (GroupIdCheck) {
                bcrypt.compare(body.Password, GroupIdCheck.Password).then((status) => {
                    if (status) {
                        response.GroupDetails = GroupIdCheck
                        response.status = true
                        resolve(response)

                    } else {
                        resolve({ PasswordErr: true })


                    }
                })
            } else {
                resolve({ GroupIdErr: true })


            }
        })

    },

    getAllCategorys: (GroupDetails) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.GROUP_COLLECTION).findOne({ FestId: GroupDetails.FestId, GroupName: GroupDetails.GroupName }).then((result) => {
                resolve(result)
            })
        })

    },

    getSessionDetails: (SessionName, GroupDetails) => {

        return new Promise(async (resolve, reject) => {
            let Group = await db.get().collection(collection.GROUP_COLLECTION).findOne({ FestId: GroupDetails.FestId, GroupName: GroupDetails.GroupName })

            if (Group) {
                if (Group.Session1.SessionName === SessionName) {
                    resolve(Group.Session1)

                } else if (Group.Session2.SessionName === SessionName) {
                    resolve(Group.Session2)
                } else if (Group.Session3.SessionName === SessionName) {
                    resolve(Group.Session3)
                } else if (Group.Session4.SessionName === SessionName) {
                    resolve(Group.Session4)
                } else if (Group.Session5.SessionName === SessionName) {
                    resolve(Group.Session5)
                } else if (Group.Session6.SessionName === SessionName) {
                    resolve(Group.Session6)
                }

            }
        })

    },
    getAllStudents: (SessionName, GroupDetails) => {
        return new Promise(async (resolve, reject) => {
            let AllStudents = await db.get().collection(collection.STUDENTS_COLLECTION).find({ FestId: GroupDetails.FestId, GroupId: GroupDetails.GroupId, SessionName: SessionName }).toArray()
            resolve(AllStudents)
        })

    },

    addStudents: (SessionName, GroupDetails, body) => {

        return new Promise(async (resolve, reject) => {
            let CheckCICno = await db.get().collection(collection.STUDENTS_COLLECTION).findOne({ FestId: GroupDetails.FestId, CicNo: body.CicNo })
            if (CheckCICno) {
                resolve(cicNoError = true)
            } else {
                let Group = await db.get().collection(collection.GROUP_COLLECTION).findOne({ FestId: GroupDetails.FestId, GroupId: GroupDetails.GroupId })
                const Group_SL = String(Group.SlNo)
                if (Group.Session1.SessionName === SessionName) {
                    const Session_SL = String(Group.Session1.SlNo)
                    var Students_SlNo = Group.Session1.Students_SlNo
                    function padFix(n) {
                        return ('00' + n).match(/\d{2}$/);
                    }
                    let num = padFix(Students_SlNo)[0]
                    var ChestNo = Group_SL + Session_SL + num

                    let StudentsDetails = {
                        FestId: GroupDetails.FestId,
                        GroupId: GroupDetails.GroupId,
                        SessionName: SessionName,
                        ChestNo: ChestNo,
                        CicNo: body.CicNo,
                        FullName: body.FullName,
                        StageEvents: [],
                        OffStageEvents: []

                    }
                    db.get().collection(collection.STUDENTS_COLLECTION).insertOne(StudentsDetails).then((response) => {
                        db.get().collection(collection.GROUP_COLLECTION).updateMany({ FestId: GroupDetails.FestId, GroupId: GroupDetails.GroupId }, [{
                            "$set": {
                                "Session1.Students_SlNo": Group.Session1.Students_SlNo + 1,
                                "Session1.StudentsCount": Group.Session1.StudentsCount + 1
                            }
                        }])
                    }).then((response) => {
                        resolve()
                    })
                } else if (Group.Session2.SessionName === SessionName) {
                    const Session_SL = String(Group.Session2.SlNo)
                    var Students_SlNo = Group.Session2.Students_SlNo
                    function padFix(n) {
                        return ('00' + n).match(/\d{2}$/);
                    }
                    let num = padFix(Students_SlNo)[0]
                    var ChestNo = Group_SL + Session_SL + num

                    let StudentsDetails = {
                        FestId: GroupDetails.FestId,
                        GroupId: GroupDetails.GroupId,
                        SessionName: SessionName,
                        ChestNo: ChestNo,
                        CicNo: body.CicNo,
                        FullName: body.FullName,
                        StageEvents: [],
                        OffStageEvents: []

                    }
                    db.get().collection(collection.STUDENTS_COLLECTION).insertOne(StudentsDetails).then((response) => {
                        db.get().collection(collection.GROUP_COLLECTION).updateMany({ FestId: GroupDetails.FestId, GroupId: GroupDetails.GroupId }, [{
                            "$set": {
                                "Session2.Students_SlNo": Group.Session2.Students_SlNo + 1,
                                "Session2.StudentsCount": Group.Session2.StudentsCount + 1
                            }
                        }])
                    }).then((response) => {
                        resolve()
                    })
                } else if (Group.Session3.SessionName === SessionName) {
                    const Session_SL = String(Group.Session3.SlNo)
                    var Students_SlNo = Group.Session3.Students_SlNo
                    function padFix(n) {
                        return ('00' + n).match(/\d{2}$/);
                    }
                    let num = padFix(Students_SlNo)[0]
                    var ChestNo = Group_SL + Session_SL + num

                    let StudentsDetails = {
                        FestId: GroupDetails.FestId,
                        GroupId: GroupDetails.GroupId,
                        SessionName: SessionName,
                        ChestNo: ChestNo,
                        CicNo: body.CicNo,
                        FullName: body.FullName,
                        StageEvents: [],
                        OffStageEvents: []

                    }
                    db.get().collection(collection.STUDENTS_COLLECTION).insertOne(StudentsDetails).then((response) => {
                        db.get().collection(collection.GROUP_COLLECTION).updateMany({ FestId: GroupDetails.FestId, GroupId: GroupDetails.GroupId }, [{
                            "$set": {
                                "Session3.Students_SlNo": Group.Session3.Students_SlNo + 1,
                                "Session3.StudentsCount": Group.Session3.StudentsCount + 1
                            }
                        }])
                    }).then((response) => {
                        resolve()
                    })
                } else if (Group.Session4.SessionName === SessionName) {
                    const Session_SL = String(Group.Session4.SlNo)
                    var Students_SlNo = Group.Session4.Students_SlNo
                    function padFix(n) {
                        return ('00' + n).match(/\d{2}$/);
                    }
                    let num = padFix(Students_SlNo)[0]
                    var ChestNo = Group_SL + Session_SL + num

                    let StudentsDetails = {
                        FestId: GroupDetails.FestId,
                        GroupId: GroupDetails.GroupId,
                        SessionName: SessionName,
                        ChestNo: ChestNo,
                        CicNo: body.CicNo,
                        FullName: body.FullName,
                        StageEvents: [],
                        OffStageEvents: []

                    }
                    db.get().collection(collection.STUDENTS_COLLECTION).insertOne(StudentsDetails).then((response) => {
                        db.get().collection(collection.GROUP_COLLECTION).updateMany({ FestId: GroupDetails.FestId, GroupId: GroupDetails.GroupId }, [{
                            "$set": {
                                "Session4.Students_SlNo": Group.Session4.Students_SlNo + 1,
                                "Session4.StudentsCount": Group.Session4.StudentsCount + 1
                            }
                        }])
                    }).then((response) => {
                        resolve()
                    })
                } else if (Group.Session5.SessionName === SessionName) {
                    const Session_SL = String(Group.Session5.SlNo)
                    var Students_SlNo = Group.Session5.Students_SlNo
                    function padFix(n) {
                        return ('00' + n).match(/\d{2}$/);
                    }
                    let num = padFix(Students_SlNo)[0]
                    var ChestNo = Group_SL + Session_SL + num

                    let StudentsDetails = {
                        FestId: GroupDetails.FestId,
                        GroupId: GroupDetails.GroupId,
                        SessionName: SessionName,
                        ChestNo: ChestNo,
                        CicNo: body.CicNo,
                        FullName: body.FullName,
                        StageEvents: [],
                        OffStageEvents: []

                    }
                    db.get().collection(collection.STUDENTS_COLLECTION).insertOne(StudentsDetails).then((response) => {
                        db.get().collection(collection.GROUP_COLLECTION).updateMany({ FestId: GroupDetails.FestId, GroupId: GroupDetails.GroupId }, [{
                            "$set": {
                                "Session5.Students_SlNo": Group.Session5.Students_SlNo + 1,
                                "Session5.StudentsCount": Group.Session5.StudentsCount + 1
                            }
                        }])
                    }).then((response) => {
                        resolve()
                    })
                } else if (Group.Session6.SessionName === SessionName) {
                    const Session_SL = String(Group.Session6.SlNo)
                    var Students_SlNo = Group.Session6.Students_SlNo
                    function padFix(n) {
                        return ('00' + n).match(/\d{2}$/);
                    }
                    let num = padFix(Students_SlNo)[0]
                    var ChestNo = Group_SL + Session_SL + num

                    let StudentsDetails = {
                        FestId: GroupDetails.FestId,
                        GroupId: GroupDetails.GroupId,
                        SessionName: SessionName,
                        ChestNo: ChestNo,
                        CicNo: body.CicNo,
                        FullName: body.FullName,
                        StageEvents: [],
                        OffStageEvents: []

                    }
                    db.get().collection(collection.STUDENTS_COLLECTION).insertOne(StudentsDetails).then((response) => {
                        db.get().collection(collection.GROUP_COLLECTION).updateMany({ FestId: GroupDetails.FestId, GroupId: GroupDetails.GroupId }, [{
                            "$set": {
                                "Session6.Students_SlNo": Group.Session6.Students_SlNo + 1,
                                "Session6.StudentsCount": Group.Session6.StudentsCount + 1
                            }
                        }])
                    }).then((respons) => {
                        resolve()
                    })
                }
            }


        })

    },

    checkStudentsCountForEvent: (FestId, GroupId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.STUDENTS_COLLECTION).findOne({ FestId: FestId, GroupId: GroupId }).then((response) => {
                resolve(response)
            })
        })

    },

    getGroupDetails: (GroupId, FestId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.GROUP_COLLECTION).findOne({ GroupId, FestId }).then((response) => {
                resolve(response)
            })
        })

    },

    getAllEvents: (FestId, GroupId, SessionName, Category) => {
        return new Promise(async (resolve, reject) => {
            var FestEvent = await db.get().collection(collection.ITEM_COLLECTION).findOne({ FestId, SessionName })


            if (Category == FestEvent.Category1) {
                let StageEvents = FestEvent.StageItem

                for (let i = 0; i < StageEvents.length; i++) {
                    let EventId = StageEvents[i].EventId
                    let EventThisId = await db.get().collection(collection.STUDENTS_COLLECTION).find({ FestId, GroupId, "StageEvents.EventId": EventId }).toArray()
                    let EventCount = EventThisId.length
                    StageEvents[i].LimitStatus = EventCount
                }
                resolve(StageEvents)
            } else if (Category == FestEvent.Category2) {
                let OffStageEvents = FestEvent.OffstageItem

                for (let i = 0; i < OffStageEvents.length; i++) {
                    let EventId = OffStageEvents[i].EventId
                    let EventThisId = await db.get().collection(collection.STUDENTS_COLLECTION).find({ FestId, GroupId, "OffStageEvents.EventId": EventId }).toArray()
                    let EventCount = EventThisId.length
                    OffStageEvents[i].LimitStatus = EventCount
                }
                resolve(OffStageEvents)
            }
        })

    },

    addEvent: (body) => {
        return new Promise(async (resolve, reject) => {
            // Student check in Group
            let StudentDetails = await db.get().collection(collection.STUDENTS_COLLECTION).findOne({ FestId: body.FestId, GroupId: body.GroupId, ChestNo: body.ChestNo })

            if (StudentDetails) {
                // check Session number
                let groupDetails = await db.get().collection(collection.GROUP_COLLECTION).findOne({ FestId: body.FestId, GroupId: body.GroupId })
                let SessionSlno = null
                let AllSessions = [groupDetails.Session1, groupDetails.Session2, groupDetails.Session3, groupDetails.Session4, groupDetails.Session5, groupDetails.Session6]
                for (let i = 0; i < AllSessions.length; i++) {

                    if (AllSessions[i] === undefined) {
                    } else if (AllSessions[i].SessionName === StudentDetails.SessionName) {
                        SessionSlno = i
                    } else {

                    }
                }
                // check stage or offStage

                let Students = await db.get().collection(collection.STUDENTS_COLLECTION).findOne({ FestId: body.FestId, GroupId: body.GroupId, ChestNo: body.ChestNo })

                let OffStage = body.Category === "Off Stage"
                let Stage = body.Category === "Stage"

                if (Stage) {

                    let StageCount = 0
                    let GeneralStageCount = 0;
                    for (let i = 0; i < Students.StageEvents.length; i++) {
                        if (Students.StageEvents[i].status === "General") {
                            GeneralStageCount = GeneralStageCount + 1
                        } else if (Students.StageEvents[i].status === "NonGeneral") {
                            StageCount = StageCount + 1
                        }
                    }
                    let TotalStageCount = StageCount + GeneralStageCount
                  
                    // already use check
                    let EventOneCheck = await db.get().collection(collection.STUDENTS_COLLECTION).findOne({ FestId: body.FestId, ChestNo: body.ChestNo, "StageEvents.EventId": body.EventId })
                    if (EventOneCheck) {
                        resolve({ EventAlreadyUsedError: true })
                    } else {
                        // Event Limit check
                        let limitStatus = await db.get().collection(collection.STUDENTS_COLLECTION).find({ FestId: body.FestId, GroupId: body.GroupId, "StageEvents.EventId": body.EventId }).toArray()
                        let eventLimit = await db.get().collection(collection.ITEM_COLLECTION).findOne({ FestId: body.FestId, "StageItem.EventId": body.EventId })
                        
                        let Event = null;
                        eventLimit.StageItem.forEach((item) => {
                            if (item.EventId === body.EventId) {
                                Event = item;
                            }
                        });
                        if (limitStatus.length < Event.EventLimit) {
                            // Session sime check

                            if (AllSessions[SessionSlno].SessionName === body.SessionName) {

                                // Studnet limit check
                                if (AllSessions[SessionSlno].StageEventCount === undefined) {
                                    resolve({ TotalCountError: true })
                                } else {
                                    if (AllSessions[SessionSlno].GeneralStageEventCount) {
                                        if (AllSessions[SessionSlno].StageEventCount > StageCount) {
                                            Event.status = "NonGeneral"
                                            // add Event
                                            db.get().collection(collection.STUDENTS_COLLECTION).updateMany({ FestId: body.FestId, GroupId: body.GroupId, ChestNo: body.ChestNo }, {
                                                $push: {
                                                    StageEvents: Event
                                                }
                                            }).then(() => {
                                                resolve({ Success: true })
                                            })
                                        } else {
                                           
                                            resolve({ StudentStageCountOver: true })
                                        }
                                    } else {
                                        if (AllSessions[SessionSlno].StageEventCount > TotalStageCount ) {
                                            Event.status = "NonGeneral"
                                            // add Event
                                            db.get().collection(collection.STUDENTS_COLLECTION).updateMany({ FestId: body.FestId, GroupId: body.GroupId, ChestNo: body.ChestNo }, {
                                                $push: {
                                                    StageEvents: Event
                                                }
                                            }).then(() => {
                                                resolve({ Success: true })
                                            })
                                        } else {
                                          
                                            resolve({ StudentStageCountOver: true })
                                        }
                                    }
                                }
                            } else {

                                let checkGeneral = null
                                for (let i = 0; i < AllSessions.length; i++) {
                                    if (AllSessions[i] === undefined) {
                                    } else if (AllSessions[i].SessionName === body.SessionName) {
                                        checkGeneral = i

                                    } else {

                                    }
                                }

                                if (AllSessions[checkGeneral].status === "NonGeneral") {
                                    resolve({ ChestNOError: true })
                                } else {
                                   
                                    let checkEventCountGeneral = null
                                    for (let i = 0; i < AllSessions.length; i++) {
                                        if (AllSessions[i] === undefined) {
                                        } else if (AllSessions[i].SessionName === StudentDetails.SessionName) {
                                            checkEventCountGeneral = i

                                        } else {

                                        }
                                    }

                                    let GeneralStageCount = 0;
                                    for (let i = 0; i < Students.StageEvents.length; i++) {
                                        if (Students.StageEvents[i].status === "General") {
                                            GeneralStageCount = GeneralStageCount + 1

                                        }
                                    }

                                    if (AllSessions[checkEventCountGeneral].GeneralStageEventCount === undefined || AllSessions[checkEventCountGeneral].GeneralStageEventCount.toString() === 'NaN') {
                                        if (AllSessions[checkEventCountGeneral].StageEventCount === undefined || AllSessions[checkEventCountGeneral].StageEventCount.toString() === 'NaN') {
                                            resolve({ TotalCountError: true })
                                        } else {

                                            // Not general  count
                                            if (AllSessions[SessionSlno].GeneralStageEventCount) {
                                                if (AllSessions[SessionSlno].GeneralStageEventCount > GeneralStageCount) {
                                                    Event.status = "General"
                                                    db.get().collection(collection.STUDENTS_COLLECTION).updateMany({ FestId: body.FestId, GroupId: body.GroupId, ChestNo: body.ChestNo }, {
                                                        $push: {
                                                            StageEvents: Event
                                                        }
                                                    }).then(() => {
                                                        resolve({ Success: true })
                                                    })
                                                } else {
                                                    resolve({ StudentStageCountOver: true })
                                                   
                                                }
                                            } else {
                                                if (AllSessions[SessionSlno].StageEventCount > TotalStageCount) {
                                                    Event.status = "General"
                                                    db.get().collection(collection.STUDENTS_COLLECTION).updateMany({ FestId: body.FestId, GroupId: body.GroupId, ChestNo: body.ChestNo }, {
                                                        $push: {
                                                            StageEvents: Event
                                                        }
                                                    }).then(() => {
                                                       
                                                        resolve({ Success: true })
                                                    })
                                                } else {
                                                    resolve({ StudentStageCountOver: true })
                                                   
                                                }
                                            }
                                        }

                                    } else {
                                        if (AllSessions[checkEventCountGeneral].GeneralStageEventCount > GeneralStageCount) {
                                            // add Event
                                            Event.status = "General"
                                            db.get().collection(collection.STUDENTS_COLLECTION).updateMany({ FestId: body.FestId, GroupId: body.GroupId, ChestNo: body.ChestNo }, {
                                                $push: {
                                                    StageEvents: Event
                                                }
                                            }).then(() => {
                                                resolve({ Success: true })
                                            })
                                        } else {
                                            resolve({ StudentStageCountOver: true })
                                        }
                                    }

                                }

                            }
                        } else {
                            resolve({ EventLimitError: true })
                        }
                    }
                } else if (OffStage) {
                    let OffStageCount = 0
                    let GeneralOffStageCount = 0;
                    for (let i = 0; i < Students.OffStageEvents.length; i++) {
                        if (Students.OffStageEvents[i].status === "General") {
                            GeneralOffStageCount = GeneralOffStageCount + 1
                        } else if (Students.OffStageEvents[i].status === "NonGeneral") {
                            OffStageCount = OffStageCount + 1
                        }
                    }
                    let TotalOffStageCount = OffStageCount + GeneralOffStageCount
                    // already use check
                    let EventOneCheck = await db.get().collection(collection.STUDENTS_COLLECTION).findOne({ FestId: body.FestId, ChestNo: body.ChestNo, "OffStageEvents.EventId": body.EventId })
                    if (EventOneCheck) {
                        resolve({ EventAlreadyUsedError: true })
                    } else {
                        // Event Limit check
                        limitStatus = await db.get().collection(collection.STUDENTS_COLLECTION).find({ FestId: body.FestId, GroupId: body.GroupId, "OffStageEvents.EventId": body.EventId }).toArray()
                        eventLimit = await db.get().collection(collection.ITEM_COLLECTION).findOne({ FestId: body.FestId, "OffstageItem.EventId": body.EventId })

                        let Event = null;
                        eventLimit.OffstageItem.forEach((item) => {
                            if (item.EventId === body.EventId) {
                                Event = item;
                            }
                        });
                        if (limitStatus.length < Event.EventLimit) {
                            // Session sime check

                            if (AllSessions[SessionSlno].SessionName === body.SessionName) {

                                // Studnet limit check
                                if (AllSessions[SessionSlno].OffStageEventCount === undefined || AllSessions[SessionSlno].OffStageEventCount.toString() === 'NaN') {
                                    resolve({ TotalCountError: true })
                                } else {
                                    if (AllSessions[SessionSlno].GeneralOffStageEventCount) {
                                        if (AllSessions[SessionSlno].OffStageEventCount > OffStageCount) {
                                            Event.status = "NonGeneral"
                                            // add Event
                                            db.get().collection(collection.STUDENTS_COLLECTION).updateMany({ FestId: body.FestId, GroupId: body.GroupId, ChestNo: body.ChestNo }, {
                                                $push: {
                                                    OffStageEvents: Event
                                                }
                                            }).then(() => {
                                                resolve({ Success: true })
                                            })
                                        } else {
                                            resolve({ StudentStageCountOver: true })
                                        }
                                    } else {
                                        if (AllSessions[SessionSlno].OffStageEventCount > TotalOffStageCount) {
                                            Event.status = "NonGeneral"
                                            // add Event
                                            db.get().collection(collection.STUDENTS_COLLECTION).updateMany({ FestId: body.FestId, GroupId: body.GroupId, ChestNo: body.ChestNo }, {
                                                $push: {
                                                    OffStageEvents: Event
                                                }
                                            }).then(() => {
                                                resolve({ Success: true })
                                            })
                                        } else {
                                            resolve({ StudentStageCountOver: true })
                                        }
                                    }
                                }
                            } else {

                                let checkGeneral = null
                                for (let i = 0; i < AllSessions.length; i++) {
                                    if (AllSessions[i] === undefined) {
                                    } else if (AllSessions[i].SessionName === body.SessionName) {
                                        checkGeneral = i

                                    } else {

                                    }
                                }

                                if (AllSessions[checkGeneral].status === "NonGeneral") {
                                    resolve({ ChestNOError: true })
                                } else {
                                    let checkEventCountGeneral = null
                                    for (let i = 0; i < AllSessions.length; i++) {
                                        if (AllSessions[i] === undefined) {
                                        } else if (AllSessions[i].SessionName === StudentDetails.SessionName) {
                                            checkEventCountGeneral = i

                                        } else {

                                        }
                                    }

                                    if (AllSessions[checkEventCountGeneral].GeneralOffStageEventCount === undefined || AllSessions[checkEventCountGeneral].GeneralOffStageEventCount.toString() === 'NaN') {
                                        if (AllSessions[checkEventCountGeneral].OffStageEventCount === undefined || AllSessions[checkEventCountGeneral].OffStageEventCount.toString() === 'NaN') {
                                            resolve({ TotalCountError: true })
                                        } else {
                                            if (AllSessions[SessionSlno].GeneralOffStageEventCount) {
                                                if (AllSessions[checkEventCountGeneral].GeneralOffStageEventCount > GeneralOffStageCount) {

                                                    Event.status = "General"
                                                    db.get().collection(collection.STUDENTS_COLLECTION).updateMany({ FestId: body.FestId, GroupId: body.GroupId, ChestNo: body.ChestNo }, {
                                                        $push: {
                                                            OffStageEvents: Event
                                                        }
                                                    }).then(() => {
                                                        resolve({ Success: true })
                                                    })
                                                } else {
                                                    resolve({ StudentStageCountOver: true })
                                                }
                                            } else {
                                                if (AllSessions[checkEventCountGeneral].OffStageEventCount > TotalOffStageCount) {

                                                    Event.status = "General"
                                                    db.get().collection(collection.STUDENTS_COLLECTION).updateMany({ FestId: body.FestId, GroupId: body.GroupId, ChestNo: body.ChestNo }, {
                                                        $push: {
                                                            OffStageEvents: Event
                                                        }
                                                    }).then(() => {
                                                        resolve({ Success: true })
                                                    })
                                                } else {
                                                    resolve({ StudentStageCountOver: true })
                                                }
                                            }
                                        }

                                    } else {

                                        if (AllSessions[checkEventCountGeneral].GeneralOffStageEventCount > GeneralOffStageCount) {

                                            // add Event
                                            Event.status = "General"
                                            db.get().collection(collection.STUDENTS_COLLECTION).updateMany({ FestId: body.FestId, GroupId: body.GroupId, ChestNo: body.ChestNo }, {
                                                $push: {
                                                    OffStageEvents: Event
                                                }
                                            }).then(() => {
                                                resolve({ Success: true })
                                            })
                                        } else {

                                            resolve({ StudentStageCountOver: true })
                                        }
                                    }

                                }

                            }
                        } else {
                            resolve({ EventLimitError: true })
                        }
                    }
                }
            } else {
                resolve({ ChestNOError: true })
            }
        })
    },

    removeStudent: (FestId, GroupId, ChestNo, SessionName) => {
        return new Promise(async (resolve, reject) => {
            let student = await db.get().collection(collection.STUDENTS_COLLECTION).findOne({ FestId, GroupId, ChestNo })
            if (student.StageEvents[0] || student.OffStageEvents[0]) {
                resolve({ studentEventTrueError: true })
            } else {
                db.get().collection(collection.STUDENTS_COLLECTION).deleteOne({ FestId, GroupId, ChestNo }).then(async (response) => {

                    let Group = await db.get().collection(collection.GROUP_COLLECTION).findOne({ FestId, GroupId })

                    if (Group.Session1.SessionName === SessionName) {
                        db.get().collection(collection.GROUP_COLLECTION).updateMany({ FestId, GroupId }, [{
                            "$set": {
                                "Session1.StudentsCount": Group.Session1.StudentsCount - 1
                            }
                        }])
                        resolve()

                    } else if (Group.Session2.SessionName === SessionName) {
                        db.get().collection(collection.GROUP_COLLECTION).updateMany({ FestId, GroupId }, [{
                            "$set": {
                                "Session2.StudentsCount": Group.Session2.StudentsCount - 1
                            }
                        }])
                        resolve()
                    } else if (Group.Session3.SessionName === SessionName) {
                        db.get().collection(collection.GROUP_COLLECTION).updateMany({ FestId, GroupId }, [{
                            "$set": {
                                "Session3.StudentsCount": Group.Session3.StudentsCount - 1
                            }
                        }])
                        resolve()
                    } else if (Group.Session4.SessionName === SessionName) {
                        db.get().collection(collection.GROUP_COLLECTION).updateMany({ FestId, GroupId }, [{
                            "$set": {
                                "Session4.StudentsCount": Group.Session4.StudentsCount - 1
                            }
                        }])
                        resolve()
                    } else if (Group.Session5.SessionName === SessionName) {
                        db.get().collection(collection.GROUP_COLLECTION).updateMany({ FestId, GroupId }, [{
                            "$set": {
                                "Session5.StudentsCount": Group.Session5.StudentsCount - 1
                            }
                        }])
                        resolve()
                    } else if (Group.Session6.SessionName === SessionName) {
                        db.get().collection(collection.GROUP_COLLECTION).updateMany({ FestId, GroupId }, [{
                            "$set": {
                                "Session6.StudentsCount": Group.Session6.StudentsCount - 1
                            }
                        }])
                        resolve()
                    }
                })
            }
        })

    },

    getEventStudents: (FestId, GroupId, CategoryName, EventId) => {
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

    getSessionFullStudents: (FestId, GroupId) => {

        return new Promise(async (resolve, reject) => {
            let AllStudent = await db.get().collection(collection.STUDENTS_COLLECTION).find({ FestId, GroupId }).toArray()
            resolve(AllStudent)
        })

    },

    editStudentDetails: (FestId, GroupId, ChestNo, body) => {

        return new Promise(async (resolve, reject) => {
            let CicNo = body.CicNo
            let thisStudent = await db.get().collection(collection.STUDENTS_COLLECTION).findOne({ FestId, GroupId, ChestNo })
            let student = await db.get().collection(collection.STUDENTS_COLLECTION).findOne({ FestId, CicNo })

            if (thisStudent.CicNo === body.CicNo) {
                db.get().collection(collection.STUDENTS_COLLECTION).updateOne({ FestId, GroupId, ChestNo }, {
                    $set: {
                        CicNo: body.CicNo,
                        FullName: body.FullName
                    }
                }).then(() => {
                    resolve()

                })
            } else if (student) {
                resolve({ CicnoMatchError: true })

            } else {
                db.get().collection(collection.STUDENTS_COLLECTION).updateOne({ FestId, GroupId, ChestNo }, {
                    $set: {
                        CicNo: body.CicNo,
                        FullName: body.FullName
                    }
                }).then(() => {
                    resolve()

                })
            }
        })

    },

    changePassword: (body) => {
        return new Promise(async (resolve, reject) => {
            let Group = await db.get().collection(collection.GROUP_COLLECTION).findOne({ FestId: body.FestId, GroupId: body.GroupId })
            bcrypt.compare(body.CurrentPassword, Group.Password).then(async (status) => {
                if (status) {

                    passwordNew = await bcrypt.hash(body.NewPassword, 10)

                    db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId: body.FestId, GroupId: body.GroupId },
                        {
                            $set: {
                                Password: passwordNew,
                                PasswordFor: body.NewPassword
                            }
                        }).then((response) => {

                            resolve(passwordSuccess = true)

                        });
                } else {
                    resolve()
                }
            })
        })

    },

    // Notification

    getNewNotificaionCount: (FestId, GroupId) => {
        return new Promise(async (resolve, reject) => {
            let group = await db.get().collection(collection.NOTIFICATION_COLLECTION).findOne({ FestId, GroupId })
            let newMessageCount = 0



            for (let i = 0; i < group.Notifications.length; i++) {
                if (group.Notifications[i].Read === 1 && group.Notifications[i].Clear === undefined) {
                    newMessageCount = newMessageCount + 1
                }
            }

            if (newMessageCount > 99) {
                newMessageCount = "99+"
                resolve(newMessageCount)

            } else if (newMessageCount === 0) {
                newMessageCount = null
                resolve(newMessageCount)
            } else {
                resolve(newMessageCount)
            }
        })

    },

    getFullNotifications: (FestId, GroupId) => {
        return new Promise(async (resolve, reject) => {
            let group = await db.get().collection(collection.NOTIFICATION_COLLECTION).findOne({ FestId, GroupId })
            let list = group.Notifications
            for (let i = 0; i < list.length; i++) {
                if (list[i].Header.length > 35) {
                    list[i].Header = list[i].Header.slice(0, 35) + "..."
                }
                if (list[i].Message.length > 140) {
                    list[i].Message = list[i].Message.slice(0, 140) + "..."
                }

            }
            resolve(list.reverse())
        })

    },

    sawNotification: (body, FestId) => {
        return new Promise((resolve, reject) => {


            db.get().collection(collection.NOTIFICATION_COLLECTION).updateOne({ FestId: FestId, GroupId: body.GroupId }, {
                $set: {
                    "Notifications.$[].View": null
                }
            }).then(() => {
                resolve()
            })

        })

    },

    readOneNotification: (body, FestId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.NOTIFICATION_COLLECTION).updateOne({
                FestId, GroupId: body.GroupId,
                Notifications: {
                    $elemMatch: {
                        MessageId: body.MessageId
                    }
                }
            }, {
                $set: {
                    "Notifications.$.Read": null
                }
            }).then((response) => {
                resolve(response)
            })
        })

    },

    clearOneNotification: (body, FestId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.NOTIFICATION_COLLECTION).updateOne({
                FestId, GroupId: body.GroupId,
                Notifications: {
                    $elemMatch: {
                        MessageId: body.MessageId
                    }
                }
            }, {
                $set: {
                    "Notifications.$.Clear": 1
                }
            }).then((response) => {
                resolve(response)
            })
        })
    },
    readFullNotification: (body, FestId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.NOTIFICATION_COLLECTION).updateOne({ FestId: FestId, GroupId: body.GroupId }, {
                $set: {
                    "Notifications.$[].Read": null
                }
            }).then((response) => {
                resolve(response)
            })

        })

    },

    getOneMessage: (FestId, GroupId, MessageId) => {
        return new Promise(async (resolve, reject) => {
            let messages = await db.get().collection(collection.NOTIFICATION_COLLECTION).findOne({ FestId, GroupId })
            let OneMessage = ''
            for (let i = 0; i < messages.Notifications.length; i++) {
                if (messages.Notifications[i].MessageId === MessageId) {
                    OneMessage = messages.Notifications[i]
                }
            }
            resolve(OneMessage)
        })

    },
    getOneMessageWithOutGroupId: (FestId, MessageId) => {

        return new Promise(async (resolve, reject) => {
            let messages = await db.get().collection(collection.NOTIFICATION_COLLECTION).find({ FestId }).toArray()
            let OneMessage = ''
            for(let a = 0; a<messages.length; a++){
              
                for (let i = 0; i < messages[a].Notifications.length; i++) {
                    console.log('hi');
                    if (messages[a].Notifications[i].MessageId === MessageId) {
                        OneMessage = messages[a].Notifications[i]
                    }
                }
            }
            resolve(OneMessage)
        })

    },

    getLetest3Notification: (FestId, GroupId) => {
        return new Promise(async (resolve, reject) => {
            let notifications = await db.get().collection(collection.NOTIFICATION_COLLECTION).findOne({ FestId, GroupId })
            var newNoti = notifications.Notifications.reverse().slice(0, 4);
            resolve(newNoti)
        })

    },

    refreshSessionPage:(body)=>{
       return new Promise((resolve, reject) => {
           db.get().collection(collection.GROUP_COLLECTION).findOne({GroupId:body.GroupId}).then((response)=>{
            
            resolve(response)
           })
       })
       
    }








}