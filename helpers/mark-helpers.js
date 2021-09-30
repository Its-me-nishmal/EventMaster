var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
const { response } = require('express')



module.exports = {
    getPointCategoryWithEventId: (FestId, Session, Category, EventId) => {
        return new Promise(async (resolve, reject) => {
            let EventSession = await db.get().collection(collection.ITEM_COLLECTION).findOne({ FestId, SessionName: Session })
            let EventPointCategory = ''

            if (Category === "Stage") {
                for (i = 0; i < EventSession.StageItem.length; i++) {
                    if (EventSession.StageItem[i].EventId === EventId) {

                        EventPointCategory = EventSession.StageItem[i].PointCategoryName
                    } else {

                    }
                }
            } else if (Category === "Off Stage") {
                for (i = 0; i < EventSession.OffstageItem.length; i++) {
                    if (EventSession.OffstageItem[i].EventId === EventId) {
                        EventPointCategory = EventSession.OffstageItem[i].PointCategoryName

                    }
                }
            }

            db.get().collection(collection.POINT_CATEGORY_COLLECTION).findOne({ FestId, categoryName: EventPointCategory }).then((response) => {
                resolve(response)
            })

        })

    },

    addIndividualMark: (body, FestId, Session, Category, EventId) => {
        return new Promise(async (resolve, reject) => {
            let pointCategory = await db.get().collection(collection.POINT_CATEGORY_COLLECTION).findOne({ FestId, categoryName: body.pointCategory })
            let studentSession = await db.get().collection(collection.STUDENTS_COLLECTION).findOne({ FestId, FestId, GroupId: body.GroupId, SessionName: Session, ChestNo: body.ChestNo, })
            let groupDetails = await db.get().collection(collection.GROUP_COLLECTION).findOne({ FestId, GroupId: body.GroupId })
            let AllSessions = [groupDetails.Session1, groupDetails.Session2, groupDetails.Session3, groupDetails.Session4, groupDetails.Session5, groupDetails.Session6]
            let Place = {}
            let Grade = {}
            let StudentMark = parseInt(0)
            console.log(Session, 'indivigul session');
            // Place and Grade creation
            if (body.places === "1st") {
                Place.name = "1st"
                Place.mark = pointCategory.places.One
            } else if (body.places === "2nd") {
                Place.name = "2nd"
                Place.mark = pointCategory.places.Two
            } else if (body.places === "3rd") {
                Place.name = "3rd"
                Place.mark = pointCategory.places.Three
            } else if (body.places === 'Nill') {
                Place.name = ''
                Place.mark = 0
            }
            if (body.grades === "A") {
                Grade.name = "A"
                Grade.mark = pointCategory.grades.A
            } else if (body.grades === "B") {
                Grade.name = "B"
                Grade.mark = pointCategory.grades.B
            } else if (body.grades === "C") {
                Grade.name = "C"
                Grade.mark = pointCategory.grades.C
            } else if (body.grades === 'Nill') {
                Grade.name = ''
                Grade.mark = 0
            }


            // if Stage
            if (Category === "Stage") {
                let event = await db.get().collection(collection.ITEM_COLLECTION).findOne({ FestId, "StageItem.EventId": EventId })

                // checking student event mark before or after add mark
                for (let i = 0; i < studentSession.StageEvents.length; i++) {
                    if (studentSession.StageEvents[i].EventId === EventId) {
                        if (studentSession.StageEvents[i].Mark !== undefined) {
                            StudentMark = studentSession.StageEvents[i].Mark
                        }
                    }
                }
                // If Nongeneral
                if (event.SessionName === Session) {
                    // student stage event mark checking
                    let StageEventsMark = parseInt(0)
                    if (studentSession.StageEventsMark === undefined) {
                        StageEventsMark = 0
                    } else {
                        StageEventsMark = studentSession.StageEventsMark
                    }


                    // add mark in student
                    db.get().collection(collection.STUDENTS_COLLECTION).updateOne({
                        FestId, GroupId: body.GroupId, SessionName: Session, ChestNo: body.ChestNo,
                        StageEvents: {
                            $elemMatch: {
                                EventId: EventId

                            }
                        }
                    }, {
                        $set: {
                            "StageEvents.$.Place": Place.name,
                            "StageEvents.$.Grade": Grade.name,
                            "StageEvents.$.Mark": parseInt(Place.mark) + parseInt(Grade.mark),
                            StageEventsMark: parseInt(StageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark

                        }
                    }).then(async () => {
                        // add mark in Session and GroupDetails
                        let GroupStageEventsMark = parseInt(0)
                        let SessionStageEventsMark = parseInt(0)
                        // Check old mark in GroupDetails
                        if (groupDetails.StageEventsMark === undefined) {
                            GroupStageEventsMark = 0
                        } else {
                            GroupStageEventsMark = groupDetails.StageEventsMark
                        }
                        // Check Old mark in Session
                        for (let i = 0; i < AllSessions.length; i++) {
                            if (AllSessions[i] === undefined) {
                            } else if (AllSessions[i].SessionName === Session) {
                                if (AllSessions[i].StageEventsMark === undefined) {
                                    SessionStageEventsMark = 0
                                } else {
                                    SessionStageEventsMark = AllSessions[i].StageEventsMark
                                }

                            }
                        }
                        db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId, GroupId: body.GroupId, "Session1.SessionName": Session }, {

                            $set: {
                                "Session1.StageEventsMark": parseInt(SessionStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark,
                                StageEventsMark: parseInt(GroupStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark
                            }
                        })

                        db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId, GroupId: body.GroupId, "Session2.SessionName": Session }, {
                            $set: {
                                "Session2.StageEventsMark": parseInt(SessionStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark,
                                StageEventsMark: parseInt(GroupStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark
                            }
                        })
                        db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId, GroupId: body.GroupId, "Session3.SessionName": Session }, {
                            $set: {
                                "Session3.StageEventsMark": parseInt(SessionStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark,
                                StageEventsMark: parseInt(GroupStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark
                            }
                        })
                        db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId, GroupId: body.GroupId, "Session4.SessionName": Session }, {
                            $set: {
                                "Session4.StageEventsMark": parseInt(SessionStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark,
                                StageEventsMark: parseInt(GroupStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark
                            }
                        })
                        db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId, GroupId: body.GroupId, "Session5.SessionName": Session }, {
                            $set: {
                                "Session5.StageEventsMark": parseInt(SessionStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark,
                                StageEventsMark: parseInt(GroupStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark
                            }
                        })
                        db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId, GroupId: body.GroupId, "Session6.SessionName": Session }, {
                            $set: {
                                "Session6.StageEventsMark": parseInt(SessionStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark,
                                StageEventsMark: parseInt(GroupStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark
                            }
                        })
                        resolve(body.ChestNo)
                    })
                } else if (event.SessionName === "GENERAL") {

                    // student General stage event mark checking
                    let GeneralStageEventsMark = parseInt(0)

                    if (studentSession.GeneralStageEventsMark === undefined) {
                        GeneralStageEventsMark = 0
                    } else {
                        GeneralStageEventsMark = studentSession.GeneralStageEventsMark
                    }

                    // student stage event mark checking
                    db.get().collection(collection.STUDENTS_COLLECTION).updateOne({
                        FestId, GroupId: body.GroupId, SessionName: Session, ChestNo: body.ChestNo,
                        StageEvents: {
                            $elemMatch: {
                                EventId: EventId,
                            }
                        }
                    }, {
                        $set: {
                            "StageEvents.$.Place": Place.name,
                            "StageEvents.$.Grade": Grade.name,
                            "StageEvents.$.Mark": parseInt(Place.mark) + parseInt(Grade.mark),
                            GeneralStageEventsMark: parseInt(GeneralStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark

                        }
                    }).then(() => {
                        // add mark in Session and GroupDetails
                        let GroupGeneralStageEventsMark = parseInt(0)
                        let SessionGeneralStageEventsMark = parseInt(0)
                        //  check old mark in GroupDetails
                        if (groupDetails.GeneralStageEventsMark === undefined) {
                            GroupGeneralStageEventsMark = 0
                        } else {
                            GroupGeneralStageEventsMark = groupDetails.GeneralStageEventsMark
                        }
                        // check old mark in Session
                        for (let i = 0; i < AllSessions.length; i++) {
                            if (AllSessions[i] === undefined) {
                            } else if (AllSessions[i].SessionName === "GENERAL") {
                                if (AllSessions[i].GeneralStageEventsMark === undefined) {
                                    SessionGeneralStageEventsMark = 0
                                } else {
                                    SessionGeneralStageEventsMark = AllSessions[i].GeneralStageEventsMark
                                }

                            }
                        }

                        db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId, GroupId: body.GroupId, "Session1.SessionName": "GENERAL" }, {

                            $set: {
                                "Session1.GeneralStageEventsMark": parseInt(SessionGeneralStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark,
                                GeneralStageEventsMark: parseInt(GroupGeneralStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark
                            }
                        })

                        db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId, GroupId: body.GroupId, "Session2.SessionName": "GENERAL" }, {
                            $set: {
                                "Session2.GeneralStageEventsMark": parseInt(SessionGeneralStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark,
                                GeneralStageEventsMark: parseInt(GroupGeneralStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark
                            }
                        })
                        db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId, GroupId: body.GroupId, "Session3.SessionName": "GENERAL" }, {
                            $set: {
                                "Session3.GeneralStageEventsMark": parseInt(SessionGeneralStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark,
                                GeneralStageEventsMark: parseInt(GroupGeneralStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark
                            }
                        })
                        db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId, GroupId: body.GroupId, "Session4.SessionName": "GENERAL" }, {
                            $set: {
                                "Session4.GeneralStageEventsMark": parseInt(SessionGeneralStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark,
                                GeneralStageEventsMark: parseInt(GroupGeneralStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark
                            }
                        })
                        db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId, GroupId: body.GroupId, "Session5.SessionName": "GENERAL" }, {
                            $set: {
                                "Session5.GeneralStageEventsMark": parseInt(SessionGeneralStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark,
                                GeneralStageEventsMark: parseInt(GroupGeneralStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark
                            }
                        })
                        db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId, GroupId: body.GroupId, "Session6.SessionName": "GENERAL" }, {
                            $set: {
                                "Session6.GeneralStageEventsMark": parseInt(SessionGeneralStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark,
                                GeneralStageEventsMark: parseInt(GroupGeneralStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark
                            }
                        })
                        resolve(body.ChestNo)
                    })
                }

            } else if (Category === "Off Stage") {
                let event = await db.get().collection(collection.ITEM_COLLECTION).findOne({ FestId, "OffstageItem.EventId": EventId })
                // checking student event mark before or after add mark
                for (let i = 0; i < studentSession.OffStageEvents.length; i++) {
                    if (studentSession.OffStageEvents[i].EventId === EventId) {
                        if (studentSession.OffStageEvents[i].Mark !== undefined) {
                            StudentMark = studentSession.OffStageEvents[i].Mark
                        }
                    }
                }
                // If Nongeneral
                if (event.SessionName === Session) {
                    // student stage event mark checking
                    let OffStageEventsMark = parseInt(0)
                    if (studentSession.OffStageEventsMark === undefined) {
                        OffStageEventsMark = 0
                    } else {
                        OffStageEventsMark = studentSession.OffStageEventsMark
                    }


                    // add mark in student
                    db.get().collection(collection.STUDENTS_COLLECTION).updateOne({
                        FestId, GroupId: body.GroupId, SessionName: Session, ChestNo: body.ChestNo,
                        OffStageEvents: {
                            $elemMatch: {
                                EventId: EventId

                            }
                        }
                    }, {
                        $set: {
                            "OffStageEvents.$.Place": Place.name,
                            "OffStageEvents.$.Grade": Grade.name,
                            "OffStageEvents.$.Mark": parseInt(Place.mark) + parseInt(Grade.mark),
                            OffStageEventsMark: parseInt(OffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark

                        }
                    }).then(async () => {
                        // add mark in Session and GroupDetails
                        let GroupOffStageEventsMark = parseInt(0)
                        let SessionOffStageEventsMark = parseInt(0)
                        // Check old mark in GroupDetails
                        if (groupDetails.OffStageEventsMark === undefined) {
                            GroupOffStageEventsMark = 0
                        } else {
                            GroupOffStageEventsMark = groupDetails.OffStageEventsMark
                        }
                        // Check Old mark in Session
                        for (let i = 0; i < AllSessions.length; i++) {
                            if (AllSessions[i] === undefined) {
                            } else if (AllSessions[i].SessionName === Session) {
                                if (AllSessions[i].OffStageEventsMark === undefined) {
                                    SessionOffStageEventsMark = 0
                                } else {
                                    SessionOffStageEventsMark = AllSessions[i].OffStageEventsMark
                                }

                            }
                        }
                        db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId, GroupId: body.GroupId, "Session1.SessionName": Session }, {

                            $set: {
                                "Session1.OffStageEventsMark": parseInt(SessionOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark,
                                OffStageEventsMark: parseInt(GroupOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark
                            }
                        })

                        db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId, GroupId: body.GroupId, "Session2.SessionName": Session }, {
                            $set: {
                                "Session2.OffStageEventsMark": parseInt(SessionOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark,
                                OffStageEventsMark: parseInt(GroupOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark
                            }
                        })
                        db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId, GroupId: body.GroupId, "Session3.SessionName": Session }, {
                            $set: {
                                "Session3.OffStageEventsMark": parseInt(SessionOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark,
                                OffStageEventsMark: parseInt(GroupOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark
                            }
                        })
                        db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId, GroupId: body.GroupId, "Session4.SessionName": Session }, {
                            $set: {
                                "Session4.OffStageEventsMark": parseInt(SessionOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark,
                                OffStageEventsMark: parseInt(GroupOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark
                            }
                        })
                        db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId, GroupId: body.GroupId, "Session5.SessionName": Session }, {
                            $set: {
                                "Session5.OffStageEventsMark": parseInt(SessionOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark,
                                OffStageEventsMark: parseInt(GroupOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark
                            }
                        })
                        db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId, GroupId: body.GroupId, "Session6.SessionName": Session }, {
                            $set: {
                                "Session6.OffStageEventsMark": parseInt(SessionOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark,
                                OffStageEventsMark: parseInt(GroupOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark
                            }
                        })
                        resolve(body.ChestNo)
                    })
                } else if (event.SessionName === "GENERAL") {

                    // student General stage event mark checking
                    let GeneralOffStageEventsMark = parseInt(0)

                    if (studentSession.GeneralOffStageEventsMark === undefined) {
                        GeneralOffStageEventsMark = 0
                    } else {
                        GeneralOffStageEventsMark = studentSession.GeneralOffStageEventsMark
                    }

                    // student stage event mark checking
                    db.get().collection(collection.STUDENTS_COLLECTION).updateOne({
                        FestId, GroupId: body.GroupId, SessionName: Session, ChestNo: body.ChestNo,
                        OffStageEvents: {
                            $elemMatch: {
                                EventId: EventId,
                            }
                        }
                    }, {
                        $set: {
                            "OffStageEvents.$.Place": Place.name,
                            "OffStageEvents.$.Grade": Grade.name,
                            "OffStageEvents.$.Mark": parseInt(Place.mark) + parseInt(Grade.mark),
                            GeneralOffStageEventsMark: parseInt(GeneralOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark

                        }
                    }).then(() => {
                        // add mark in Session and GroupDetails
                        let GroupGeneralOffStageEventsMark = parseInt(0)
                        let SessionGeneralOffStageEventsMark = parseInt(0)
                        //  check old mark in GroupDetails
                        if (groupDetails.GeneralOffStageEventsMark === undefined) {
                            GroupGeneralOffStageEventsMark = 0
                        } else {
                            GroupGeneralOffStageEventsMark = groupDetails.GeneralOffStageEventsMark
                        }
                        // check old mark in Session
                        for (let i = 0; i < AllSessions.length; i++) {
                            if (AllSessions[i] === undefined) {
                            } else if (AllSessions[i].SessionName === "GENERAL") {
                                if (AllSessions[i].GeneralOffStageEventsMark === undefined) {
                                    SessionGeneralOffStageEventsMark = 0
                                } else {
                                    SessionGeneralOffStageEventsMark = AllSessions[i].GeneralOffStageEventsMark
                                }

                            }
                        }

                        db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId, GroupId: body.GroupId, "Session1.SessionName": "GENERAL" }, {

                            $set: {
                                "Session1.GeneralOffStageEventsMark": parseInt(SessionGeneralOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark,
                                GeneralOffStageEventsMark: parseInt(GroupGeneralOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark
                            }
                        })

                        db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId, GroupId: body.GroupId, "Session2.SessionName": "GENERAL" }, {
                            $set: {
                                "Session2.GeneralOffStageEventsMark": parseInt(SessionGeneralOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark,
                                GeneralOffStageEventsMark: parseInt(GroupGeneralOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark
                            }
                        })
                        db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId, GroupId: body.GroupId, "Session3.SessionName": "GENERAL" }, {
                            $set: {
                                "Session3.GeneralOffStageEventsMark": parseInt(SessionGeneralOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark,
                                GeneralOffStageEventsMark: parseInt(GroupGeneralOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark
                            }
                        })
                        db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId, GroupId: body.GroupId, "Session4.SessionName": "GENERAL" }, {
                            $set: {
                                "Session4.GeneralOffStageEventsMark": parseInt(SessionGeneralOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark,
                                GeneralOffStageEventsMark: parseInt(GroupGeneralOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark
                            }
                        })
                        db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId, GroupId: body.GroupId, "Session5.SessionName": "GENERAL" }, {
                            $set: {
                                "Session5.GeneralOffStageEventsMark": parseInt(SessionGeneralOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark,
                                GeneralOffStageEventsMark: parseInt(GroupGeneralOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark
                            }
                        })
                        db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId, GroupId: body.GroupId, "Session6.SessionName": "GENERAL" }, {
                            $set: {
                                "Session6.GeneralOffStageEventsMark": parseInt(SessionGeneralOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark,
                                GeneralOffStageEventsMark: parseInt(GroupGeneralOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark
                            }
                        })
                        resolve(body.ChestNo)
                    })
                }
            }
        })

    },

    addGroupMark: (body, FestId, Session, Category, EventId) => {
        return new Promise(async (resolve, reject) => {
            let Stage = await db.get().collection(collection.STUDENTS_COLLECTION).find({ FestId, GroupId: body.GroupId, "StageEvents.EventId": EventId }).toArray()
            let OffStage = await db.get().collection(collection.STUDENTS_COLLECTION).find({ FestId, GroupId: body.GroupId, "OffStageEvents.EventId": EventId }).toArray()
            let pointCategory = await db.get().collection(collection.POINT_CATEGORY_COLLECTION).findOne({ FestId, categoryName: body.pointCategory })
            let groupDetails = await db.get().collection(collection.GROUP_COLLECTION).findOne({ FestId, GroupId: body.GroupId })
            let AllSessions = [groupDetails.Session1, groupDetails.Session2, groupDetails.Session3, groupDetails.Session4, groupDetails.Session5, groupDetails.Session6]
            console.log(Session, 'group session');
            let Place = {}
            let Grade = {}
            let StudentMark = parseInt(0)

            // Place and Grade creation
            if (body.places === "1st") {
                Place.name = "1st"
                Place.mark = pointCategory.places.One
            } else if (body.places === "2nd") {
                Place.name = "2nd"
                Place.mark = pointCategory.places.Two
            } else if (body.places === "3rd") {
                Place.name = "3rd"
                Place.mark = pointCategory.places.Three
            } else if (body.places === 'Nill') {
                Place.name = ''
                Place.mark = 0
            }
            if (body.grades === "A") {
                Grade.name = "A"
                Grade.mark = pointCategory.grades.A
            } else if (body.grades === "B") {
                Grade.name = "B"
                Grade.mark = pointCategory.grades.B
            } else if (body.grades === "C") {
                Grade.name = "C"
                Grade.mark = pointCategory.grades.C
            } else if (body.grades === 'Nill') {
                Grade.name = ''
                Grade.mark = 0
            }


            // if Stage
            if (Category === "Stage") {

                let studentSession = await db.get().collection(collection.STUDENTS_COLLECTION).findOne({ FestId, GroupId: body.GroupId, ChestNo: Stage[0].ChestNo, })
                let event = await db.get().collection(collection.ITEM_COLLECTION).findOne({ FestId, "StageItem.EventId": EventId })


                // checking student event mark before or after add mark
                for (let i = 0; i < studentSession.StageEvents.length; i++) {
                    if (studentSession.StageEvents[i].EventId === EventId) {
                        if (studentSession.StageEvents[i].Mark !== undefined) {
                            StudentMark = studentSession.StageEvents[i].Mark
                        }
                    }
                }
                // If Nongeneral
                if (event.SessionName === "GENERAL") {

                    for (let i = 0; i < Stage.length; i++) {

                        let StudentStageEventMark = await db.get().collection(collection.STUDENTS_COLLECTION).findOne({
                            FestId, GroupId: body.GroupId, ChestNo: Stage[i].ChestNo,
                        })
                        // student General stage event mark checking
                        let GeneralStageEventsMark = parseInt(0)

                        if (StudentStageEventMark.GeneralStageEventsMark === undefined) {
                            GeneralStageEventsMark = 0
                        } else {
                            GeneralStageEventsMark = StudentStageEventMark.GeneralStageEventsMark
                        }

                        db.get().collection(collection.STUDENTS_COLLECTION).updateOne({
                            FestId, GroupId: body.GroupId, ChestNo: Stage[i].ChestNo,
                            StageEvents: {
                                $elemMatch: {
                                    EventId: EventId,
                                }
                            }
                        }, {
                            $set: {
                                "StageEvents.$.Place": Place.name,
                                "StageEvents.$.Grade": Grade.name,
                                "StageEvents.$.Mark": parseInt(Place.mark) + parseInt(Grade.mark),
                                GeneralStageEventsMark: parseInt(GeneralStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark

                            }
                        })
                    }

                    // add mark in Session and GroupDetails
                    let GroupGeneralStageEventsMark = parseInt(0)
                    let SessionGeneralStageEventsMark = parseInt(0)
                    //  check old mark in GroupDetails
                    if (groupDetails.GeneralStageEventsMark === undefined) {
                        GroupGeneralStageEventsMark = 0
                    } else {
                        GroupGeneralStageEventsMark = groupDetails.GeneralStageEventsMark
                    }
                    // check old mark in Session
                    for (let i = 0; i < AllSessions.length; i++) {
                        if (AllSessions[i] === undefined) {
                        } else if (AllSessions[i].SessionName === "GENERAL") {
                            if (AllSessions[i].GeneralStageEventsMark === undefined) {
                                SessionGeneralStageEventsMark = 0
                            } else {
                                SessionGeneralStageEventsMark = AllSessions[i].GeneralStageEventsMark
                            }

                        }
                    }

                    db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId, GroupId: body.GroupId, "Session1.SessionName": "GENERAL" }, {

                        $set: {
                            "Session1.GeneralStageEventsMark": parseInt(SessionGeneralStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark,
                            GeneralStageEventsMark: parseInt(GroupGeneralStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark
                        }
                    })

                    db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId, GroupId: body.GroupId, "Session2.SessionName": "GENERAL" }, {
                        $set: {
                            "Session2.GeneralStageEventsMark": parseInt(SessionGeneralStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark,
                            GeneralStageEventsMark: parseInt(GroupGeneralStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark
                        }
                    })
                    db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId, GroupId: body.GroupId, "Session3.SessionName": "GENERAL" }, {
                        $set: {
                            "Session3.GeneralStageEventsMark": parseInt(SessionGeneralStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark,
                            GeneralStageEventsMark: parseInt(GroupGeneralStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark
                        }
                    })
                    db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId, GroupId: body.GroupId, "Session4.SessionName": "GENERAL" }, {
                        $set: {
                            "Session4.GeneralStageEventsMark": parseInt(SessionGeneralStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark,
                            GeneralStageEventsMark: parseInt(GroupGeneralStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark
                        }
                    })
                    db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId, GroupId: body.GroupId, "Session5.SessionName": "GENERAL" }, {
                        $set: {
                            "Session5.GeneralStageEventsMark": parseInt(SessionGeneralStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark,
                            GeneralStageEventsMark: parseInt(GroupGeneralStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark
                        }
                    })
                    db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId, GroupId: body.GroupId, "Session6.SessionName": "GENERAL" }, {
                        $set: {
                            "Session6.GeneralStageEventsMark": parseInt(SessionGeneralStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark,
                            GeneralStageEventsMark: parseInt(GroupGeneralStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark
                        }
                    })
                    resolve()

                } else if (event.SessionName === Session) {

                    // add mark in all student
                    for (let i = 0; i < Stage.length; i++) {
                        let StudentStageEventMark = await db.get().collection(collection.STUDENTS_COLLECTION).findOne({
                            FestId, GroupId: body.GroupId, ChestNo: Stage[i].ChestNo,
                        })
                        // student stage event mark checking 
                        let StageEventsMark = parseInt(0)
                        if (StudentStageEventMark.StageEventsMark === undefined) {
                            StageEventsMark = 0
                        } else {
                            StageEventsMark = StudentStageEventMark.StageEventsMark
                        }
                        db.get().collection(collection.STUDENTS_COLLECTION).updateOne({
                            FestId, GroupId: body.GroupId, ChestNo: Stage[i].ChestNo,
                            StageEvents: {
                                $elemMatch: {
                                    EventId: EventId

                                }
                            }
                        }, {
                            $set: {
                                "StageEvents.$.Place": Place.name,
                                "StageEvents.$.Grade": Grade.name,
                                "StageEvents.$.Mark": parseInt(Place.mark) + parseInt(Grade.mark),
                                StageEventsMark: parseInt(StageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark

                            }
                        })
                    }

                    // add mark in Session and GroupDetails
                    let GroupStageEventsMark = parseInt(0)
                    let SessionStageEventsMark = parseInt(0)
                    // Check old mark in GroupDetails
                    if (groupDetails.StageEventsMark === undefined) {
                        GroupStageEventsMark = 0
                    } else {
                        GroupStageEventsMark = groupDetails.StageEventsMark
                    }
                    // Check Old mark in Session
                    for (let i = 0; i < AllSessions.length; i++) {
                        if (AllSessions[i] === undefined) {
                        } else if (AllSessions[i].SessionName === Session) {
                            if (AllSessions[i].StageEventsMark === undefined) {
                                SessionStageEventsMark = 0
                            } else {
                                SessionStageEventsMark = AllSessions[i].StageEventsMark
                            }

                        }
                    }
                    db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId, GroupId: body.GroupId, "Session1.SessionName": Session }, {

                        $set: {
                            "Session1.StageEventsMark": parseInt(SessionStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark,
                            StageEventsMark: parseInt(GroupStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark
                        }
                    })

                    db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId, GroupId: body.GroupId, "Session2.SessionName": Session }, {
                        $set: {
                            "Session2.StageEventsMark": parseInt(SessionStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark,
                            StageEventsMark: parseInt(GroupStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark
                        }
                    })
                    db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId, GroupId: body.GroupId, "Session3.SessionName": Session }, {
                        $set: {
                            "Session3.StageEventsMark": parseInt(SessionStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark,
                            StageEventsMark: parseInt(GroupStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark
                        }
                    })
                    db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId, GroupId: body.GroupId, "Session4.SessionName": Session }, {
                        $set: {
                            "Session4.StageEventsMark": parseInt(SessionStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark,
                            StageEventsMark: parseInt(GroupStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark
                        }
                    })
                    db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId, GroupId: body.GroupId, "Session5.SessionName": Session }, {
                        $set: {
                            "Session5.StageEventsMark": parseInt(SessionStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark,
                            StageEventsMark: parseInt(GroupStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark
                        }
                    })
                    db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId, GroupId: body.GroupId, "Session6.SessionName": Session }, {
                        $set: {
                            "Session6.StageEventsMark": parseInt(SessionStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark,
                            StageEventsMark: parseInt(GroupStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark
                        }
                    })
                    resolve()


                }

            } else if (Category === "Off Stage") {
                console.log(StudentMark, 'student');
                let studentSession = await db.get().collection(collection.STUDENTS_COLLECTION).findOne({ FestId, FestId, GroupId: body.GroupId, ChestNo: OffStage[0].ChestNo, })
                let event = await db.get().collection(collection.ITEM_COLLECTION).findOne({ FestId, "OffstageItem.EventId": EventId })
                // checking student event mark before or after add mark
                for (let i = 0; i < studentSession.OffStageEvents.length; i++) {
                    if (studentSession.OffStageEvents[i].EventId === EventId) {
                        if (studentSession.OffStageEvents[i].Mark !== undefined) {
                            StudentMark = studentSession.OffStageEvents[i].Mark
                        }
                    }
                }
                console.log(StudentMark, 'student2');
                // If Nongeneral
                if (event.SessionName === "GENERAL") {

                    // student General stage event mark checking

                    // student stage event mark checking
                    for (let i = 0; i < OffStage.length; i++) {
                        let StudentOffStageEventMark = await db.get().collection(collection.STUDENTS_COLLECTION).findOne({
                            FestId, GroupId: body.GroupId, ChestNo: OffStage[i].ChestNo,
                        })

                        let GeneralOffStageEventsMark = parseInt(0)

                        if (StudentOffStageEventMark.GeneralOffStageEventsMark === undefined) {
                            GeneralOffStageEventsMark = 0
                        } else {
                            GeneralOffStageEventsMark = StudentOffStageEventMark.GeneralOffStageEventsMark
                        }
                        db.get().collection(collection.STUDENTS_COLLECTION).updateOne({
                            FestId, GroupId: body.GroupId, ChestNo: OffStage[i].ChestNo,
                            OffStageEvents: {
                                $elemMatch: {
                                    EventId: EventId,
                                }
                            }
                        }, {
                            $set: {
                                "OffStageEvents.$.Place": Place.name,
                                "OffStageEvents.$.Grade": Grade.name,
                                "OffStageEvents.$.Mark": parseInt(Place.mark) + parseInt(Grade.mark),
                                GeneralOffStageEventsMark: parseInt(GeneralOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark

                            }
                        })
                    }

                    // add mark in Session and GroupDetails
                    let GroupGeneralOffStageEventsMark = parseInt(0)
                    let SessionGeneralOffStageEventsMark = parseInt(0)
                    //  check old mark in GroupDetails
                    if (groupDetails.GeneralOffStageEventsMark === undefined) {
                        GroupGeneralOffStageEventsMark = 0
                    } else {
                        GroupGeneralOffStageEventsMark = groupDetails.GeneralOffStageEventsMark
                    }
                    // check old mark in Session
                    for (let i = 0; i < AllSessions.length; i++) {
                        if (AllSessions[i] === undefined) {
                        } else if (AllSessions[i].SessionName === "GENERAL") {
                            if (AllSessions[i].GeneralOffStageEventsMark === undefined) {
                                SessionGeneralOffStageEventsMark = 0
                            } else {
                                SessionGeneralOffStageEventsMark = AllSessions[i].GeneralOffStageEventsMark
                            }

                        }
                    }

                    db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId, GroupId: body.GroupId, "Session1.SessionName": "GENERAL" }, {

                        $set: {
                            "Session1.GeneralOffStageEventsMark": parseInt(SessionGeneralOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark,
                            GeneralOffStageEventsMark: parseInt(GroupGeneralOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark
                        }
                    })

                    db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId, GroupId: body.GroupId, "Session2.SessionName": "GENERAL" }, {
                        $set: {
                            "Session2.GeneralOffStageEventsMark": parseInt(SessionGeneralOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark,
                            GeneralOffStageEventsMark: parseInt(GroupGeneralOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark
                        }
                    })
                    db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId, GroupId: body.GroupId, "Session3.SessionName": "GENERAL" }, {
                        $set: {
                            "Session3.GeneralOffStageEventsMark": parseInt(SessionGeneralOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark,
                            GeneralOffStageEventsMark: parseInt(GroupGeneralOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark
                        }
                    })
                    db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId, GroupId: body.GroupId, "Session4.SessionName": "GENERAL" }, {
                        $set: {
                            "Session4.GeneralOffStageEventsMark": parseInt(SessionGeneralOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark,
                            GeneralOffStageEventsMark: parseInt(GroupGeneralOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark
                        }
                    })
                    db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId, GroupId: body.GroupId, "Session5.SessionName": "GENERAL" }, {
                        $set: {
                            "Session5.GeneralOffStageEventsMark": parseInt(SessionGeneralOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark,
                            GeneralOffStageEventsMark: parseInt(GroupGeneralOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark
                        }
                    })
                    db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId, GroupId: body.GroupId, "Session6.SessionName": "GENERAL" }, {
                        $set: {
                            "Session6.GeneralOffStageEventsMark": parseInt(SessionGeneralOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark,
                            GeneralOffStageEventsMark: parseInt(GroupGeneralOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark
                        }
                    })
                    resolve()


                } else if (event.SessionName === Session) {


                    // add mark in student
                    for (let i = 0; i < OffStage.length; i++) {
                        let StudentStageEventMark = await db.get().collection(collection.STUDENTS_COLLECTION).findOne({
                            FestId, GroupId: body.GroupId, ChestNo: OffStage[i].ChestNo,
                        })
                        let OffStageEventsMark = parseInt(0)
                        if (StudentStageEventMark.OffStageEventsMark === undefined) {
                            OffStageEventsMark = 0
                        } else {
                            OffStageEventsMark = StudentStageEventMark.OffStageEventsMark
                        }

                        db.get().collection(collection.STUDENTS_COLLECTION).updateOne({
                            FestId, GroupId: body.GroupId, ChestNo: OffStage[i].ChestNo,
                            OffStageEvents: {
                                $elemMatch: {
                                    EventId: EventId

                                }
                            }
                        }, {
                            $set: {
                                "OffStageEvents.$.Place": Place.name,
                                "OffStageEvents.$.Grade": Grade.name,
                                "OffStageEvents.$.Mark": parseInt(Place.mark) + parseInt(Grade.mark),
                                OffStageEventsMark: parseInt(OffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark

                            }
                        })
                    }

                    // add mark in Session and GroupDetails
                    let GroupOffStageEventsMark = parseInt(0)
                    let SessionOffStageEventsMark = parseInt(0)
                    // Check old mark in GroupDetails
                    if (groupDetails.OffStageEventsMark === undefined) {
                        GroupOffStageEventsMark = 0
                    } else {
                        GroupOffStageEventsMark = groupDetails.OffStageEventsMark
                    }
                    // Check Old mark in Session
                    for (let i = 0; i < AllSessions.length; i++) {
                        if (AllSessions[i] === undefined) {
                        } else if (AllSessions[i].SessionName === Session) {
                            if (AllSessions[i].OffStageEventsMark === undefined) {
                                SessionOffStageEventsMark = 0
                            } else {
                                SessionOffStageEventsMark = AllSessions[i].OffStageEventsMark
                            }

                        }
                    }
                    db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId, GroupId: body.GroupId, "Session1.SessionName": Session }, {

                        $set: {
                            "Session1.OffStageEventsMark": parseInt(SessionOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark,
                            OffStageEventsMark: parseInt(GroupOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark
                        }
                    })

                    db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId, GroupId: body.GroupId, "Session2.SessionName": Session }, {
                        $set: {
                            "Session2.OffStageEventsMark": parseInt(SessionOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark,
                            OffStageEventsMark: parseInt(GroupOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark
                        }
                    })
                    db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId, GroupId: body.GroupId, "Session3.SessionName": Session }, {
                        $set: {
                            "Session3.OffStageEventsMark": parseInt(SessionOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark,
                            OffStageEventsMark: parseInt(GroupOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark
                        }
                    })
                    db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId, GroupId: body.GroupId, "Session4.SessionName": Session }, {
                        $set: {
                            "Session4.OffStageEventsMark": parseInt(SessionOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark,
                            OffStageEventsMark: parseInt(GroupOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark
                        }
                    })
                    db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId, GroupId: body.GroupId, "Session5.SessionName": Session }, {
                        $set: {
                            "Session5.OffStageEventsMark": parseInt(SessionOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark,
                            OffStageEventsMark: parseInt(GroupOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark
                        }
                    })
                    db.get().collection(collection.GROUP_COLLECTION).updateOne({ FestId, GroupId: body.GroupId, "Session6.SessionName": Session }, {
                        $set: {
                            "Session6.OffStageEventsMark": parseInt(SessionOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark,
                            OffStageEventsMark: parseInt(GroupOffStageEventsMark) + (parseInt(Place.mark) + parseInt(Grade.mark)) - StudentMark
                        }
                    })
                    resolve()



                }
            }
        
        })

},

    getAllCategorysWithFestIdOnly: (FestId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.GROUP_COLLECTION).findOne({ FestId }).then((response) => {
                resolve(response)
            })
        })

    },

        addOtherMark: (body) => {
            return new Promise(async (resolve, reject) => {
                if (body.GroupId && body.SessionName && body.ChestNo) {
                    let checkStudent = await db.get().collection(collection.STUDENTS_COLLECTION).findOne({ FestId: body.FestId, GroupId: body.GroupId, SessionName: body.SessionName, ChestNo: body.ChestNo })
                    if (checkStudent) {
                        body.SubType = 'Student',
                            body.Type = 'Mark'
                        await db.get().collection(collection.OTHER_MARK_COLLECTION).insertOne(body).then((response) => {
                            resolve(response)
                        })
                    } else {

                        resolve()
                    }
                } else if (body.GroupId && body.SessionName && body.ChestNo === undefined) {
                    body.SubType = 'Session'
                    body.Type = 'Mark'
                    db.get().collection(collection.OTHER_MARK_COLLECTION).insertOne(body).then((response) => {
                        resolve(response)
                    })
                } else if (body.GroupId && body.SessionName === undefined && body.ChestNo === undefined) {
                    body.SubType = 'Group'
                    body.Type = 'Mark'
                    db.get().collection(collection.OTHER_MARK_COLLECTION).insertOne(body).then((response) => {
                        resolve(response)
                    })
                }
            })

        },

            addToppers: (body) => {
                return new Promise(async (resolve, reject) => {
                    if (body.GroupId && body.SessionName && body.ChestNo) {
                        let checkStudent = await db.get().collection(collection.STUDENTS_COLLECTION).findOne({ FestId: body.FestId, GroupId: body.GroupId, SessionName: body.SessionName, ChestNo: body.ChestNo })
                        if (checkStudent) {
                            body.SubType = 'Student',
                                body.Type = 'Toppers'
                            await db.get().collection(collection.OTHER_MARK_COLLECTION).insertOne(body).then((response) => {
                                resolve(response)
                            })
                        } else {

                            resolve()
                        }
                    } else if (body.GroupId && body.SessionName && body.ChestNo === undefined) {
                        body.SubType = 'Session'
                        body.Type = 'Toppers'
                        db.get().collection(collection.OTHER_MARK_COLLECTION).insertOne(body).then((response) => {
                            resolve(response)
                        })
                    } else if (body.GroupId && body.SessionName === undefined && body.ChestNo === undefined) {
                        body.SubType = 'Group'
                        body.Type = 'Toppers'
                        db.get().collection(collection.OTHER_MARK_COLLECTION).insertOne(body).then((response) => {
                            resolve(response)
                        })
                    }
                })

            },
}