var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
const { reject, resolve } = require('promise')
const { response } = require('express')

module.exports = {
    TotalEventCount: (FestId) => {
        return new Promise(async (resolve, reject) => {
            var events = await db.get().collection(collection.ITEM_COLLECTION).find({ FestId }).toArray()
            let eventCountStage = 0
            let eventCountOffStage = 0

            for (let i = 0; i < events.length; i++) {
                eventCountStage = events[i].StageItem.length + eventCountStage
                eventCountOffStage = events[i].OffstageItem.length + eventCountOffStage
            }

            resolve(eventCountStage + eventCountOffStage)

        })

    },

    PublisedResultCount: (FestId) => {
        return new Promise(async (resolve, reject) => {
            var events = await db.get().collection(collection.ITEM_COLLECTION).find({ FestId }).toArray()
            let publisedResultCount = 0

            for (let i = 0; i < events.length; i++) {
                for (let a = 0; a < events[i].StageItem.length; a++) {
                    if (events[i].StageItem[a].Result) {
                        publisedResultCount = publisedResultCount + 1
                    }
                }
                for (let a = 0; a < events[i].OffstageItem.length; a++) {
                    if (events[i].OffstageItem[a].Result) {
                        publisedResultCount = publisedResultCount + 1
                    }
                }
            }
            resolve(publisedResultCount)
        })
    },

    totalGroupsMark: (FestId) => {
        return new Promise(async (resolve, reject) => {
            let allGroup = await db.get().collection(collection.GROUP_COLLECTION).find({ FestId }).toArray()
            let TotalGroupsMark = []
            let FullTotal = 0
            for (let i = 0; i < allGroup.length; i++) {
                let OtherMark = await db.get().collection(collection.OTHER_MARK_COLLECTION).find({ FestId, GroupId: allGroup[i].GroupId }).toArray()

                let Obj = {
                    GroupId: allGroup[i].GroupId,
                    GroupName: allGroup[i].GroupName,
                    TotalMark: 0,
                    Percetage: null
                }
                if(allGroup[i].StageEventsMark){
                    Obj.TotalMark = Obj.TotalMark + allGroup[i].StageEventsMark
                }
                 if(allGroup[i].OffStageEventsMark){
                    Obj.TotalMark = Obj.TotalMark + allGroup[i].OffStageEventsMark
                }
                 if(allGroup[i].GeneralStageEventsMark){
                    Obj.TotalMark = Obj.TotalMark + allGroup[i].GeneralStageEventsMark
                }
                if(allGroup[i].GeneralOffStageEventsMark){
                    Obj.TotalMark = Obj.TotalMark + allGroup[i].GeneralOffStageEventsMark
                }
                
               
                for (let z = 0; z < OtherMark.length; z++) {
                    if (OtherMark[z].TotalMark) {
                        Obj.TotalMark = Obj.TotalMark + parseInt(OtherMark[z].TotalMark)
                    }
                }
                Obj.TotalMark = Obj.TotalMark.toString()
                if (Obj.TotalMark === "NaN") {
                    Obj.TotalMark = 0
                } else {
                    Obj.TotalMark = parseInt(Obj.TotalMark)
                }

                TotalGroupsMark[i] = Obj
                FullTotal = Obj.TotalMark + FullTotal

            }
            for (let a = 0; a < TotalGroupsMark.length; a++) {
                TotalGroupsMark[a].Percetage = TotalGroupsMark[a].TotalMark / FullTotal * 100
                // cut after dot
                var b = TotalGroupsMark[a].Percetage.toString()
                var num = b.indexOf(".");
                if (b === "NaN") {
                    b = 0
                    b.toString()
                }

                if (num == -1) {
                    TotalGroupsMark[a].Percetage = b
                } else {
                    TotalGroupsMark[a].Percetage = b.slice(0, num)
                }

            }

            resolve(TotalGroupsMark)

        })

    },

    sessionBaiseMarkList: (FestId) => {
        return new Promise(async (resolve, reject) => {
            let allGroup = await db.get().collection(collection.GROUP_COLLECTION).find({ FestId }).toArray()
      
            let SessionMarkList = []
            for (let i = 0; i < allGroup.length; i++) {

                let OtherMark = await db.get().collection(collection.OTHER_MARK_COLLECTION).find({ FestId, GroupId: allGroup[i].GroupId }).toArray()
                let Obj = {
                    GroupId: allGroup[i].GroupId,
                    GroupName: allGroup[i].GroupName,
                    Sessions: []
                }
                if (allGroup[i].Session1) {

                    if (allGroup[i].Session1.OffStageEventsMark === undefined) {
                        allGroup[i].Session1.OffStageEventsMark = 0
                    }
                    if (allGroup[i].Session1.StageEventsMark === undefined) {
                        allGroup[i].Session1.StageEventsMark = 0
                    }
                    Obj.Sessions[0] = {
                        SessionName: allGroup[i].Session1.SessionName,
                        StageEventsMark: allGroup[i].Session1.StageEventsMark,
                        OffStageEventsMark: allGroup[i].Session1.OffStageEventsMark,
                        OtherMark: 0,
                        TotalEventMark: allGroup[i].Session1.StageEventsMark + allGroup[i].Session1.OffStageEventsMark,
                    }
                    for (let a = 0; a < OtherMark.length; a++) {
                        if (OtherMark[a].TotalMark) {
                            if (allGroup[i].Session1.SessionName == OtherMark[a].SessionName) {
                               
                                Obj.Sessions[0].OtherMark = Obj.Sessions[0].OtherMark + parseInt(OtherMark[a].TotalMark)
                                Obj.Sessions[0].TotalEventMark = Obj.Sessions[0].TotalEventMark +  parseInt(OtherMark[a].TotalMark)

                            }
                        }
                    }
                }
                if (allGroup[i].Session2) {
                    if (allGroup[i].Session2.OffStageEventsMark === undefined) {
                        allGroup[i].Session2.OffStageEventsMark = 0
                    }
                    if (allGroup[i].Session2.StageEventsMark === undefined) {
                        allGroup[i].Session2.StageEventsMark = 0
                    }
                    Obj.Sessions[1] = {
                        SessionName: allGroup[i].Session2.SessionName,
                        StageEventsMark: allGroup[i].Session2.StageEventsMark,
                        OffStageEventsMark: allGroup[i].Session2.OffStageEventsMark,
                        OtherMark: 0,
                        TotalEventMark: allGroup[i].Session2.StageEventsMark + allGroup[i].Session2.OffStageEventsMark,
                    }
                    for (let a = 0; a < OtherMark.length; a++) {
                        if (OtherMark[a].TotalMark) {
                            if (allGroup[i].Session2.SessionName == OtherMark[a].SessionName) {
                                Obj.Sessions[1].OtherMark = Obj.Sessions[1].OtherMark + parseInt(OtherMark[a].TotalMark)
                                Obj.Sessions[1].TotalEventMark = Obj.Sessions[1].TotalEventMark + parseInt(Obj.Sessions[1].OtherMark)
                            }
                        }
                    }
                }
                if (allGroup[i].Session3) {
                    if (allGroup[i].Session3.OffStageEventsMark === undefined) {
                        allGroup[i].Session3.OffStageEventsMark = 0
                    }
                    if (allGroup[i].Session3.StageEventsMark === undefined) {
                        allGroup[i].Session3.StageEventsMark = 0
                    }
                    Obj.Sessions[2] = {
                        SessionName: allGroup[i].Session3.SessionName,
                        StageEventsMark: allGroup[i].Session3.StageEventsMark,
                        OffStageEventsMark: allGroup[i].Session3.OffStageEventsMark,
                        OtherMark: 0,
                        TotalEventMark: allGroup[i].Session3.StageEventsMark + allGroup[i].Session3.OffStageEventsMark,
                    }
                    for (let a = 0; a < OtherMark.length; a++) {
                        if (OtherMark[a].TotalMark) {
                            if (allGroup[i].Session3.SessionName == OtherMark[a].SessionName) {
                                Obj.Sessions[2].OtherMark = Obj.Sessions[2].OtherMark + parseInt(OtherMark[a].TotalMark)
                                Obj.Sessions[2].TotalEventMark = Obj.Sessions[2].TotalEventMark + parseInt(Obj.Sessions[2].OtherMark)
                            }
                        }
                    }
                }
                if (allGroup[i].Session4) {
                    if (allGroup[i].Session4.OffStageEventsMark === undefined) {
                        allGroup[i].Session4.OffStageEventsMark = 0
                    }
                    if (allGroup[i].Session4.StageEventsMark === undefined) {
                        allGroup[i].Session4.StageEventsMark = 0
                    }
                    Obj.Sessions[3] = {
                        SessionName: allGroup[i].Session4.SessionName,
                        StageEventsMark: allGroup[i].Session4.StageEventsMark,
                        OffStageEventsMark: allGroup[i].Session4.OffStageEventsMark,
                        OtherMark: 0,
                        TotalEventMark: allGroup[i].Session4.StageEventsMark + allGroup[i].Session4.OffStageEventsMark,
                    }
                    for (let a = 0; a < OtherMark.length; a++) {
                        if (OtherMark[a].TotalMark) {
                            if (allGroup[i].Session4.SessionName == OtherMark[a].SessionName) {
                                Obj.Sessions[3].OtherMark = Obj.Sessions[3].OtherMark + parseInt(OtherMark[a].TotalMark)
                                Obj.Sessions[3].TotalEventMark = Obj.Sessions[3].TotalEventMark + parseInt(OtherMark[a].TotalMark)
                            }
                        }
                    }
                }
                if (allGroup[i].Session5) {
                    if (allGroup[i].Session5.OffStageEventsMark === undefined) {
                        allGroup[i].Session5.OffStageEventsMark = 0
                    }
                    if (allGroup[i].Session5.StageEventsMark === undefined) {
                        allGroup[i].Session5.StageEventsMark = 0
                    }
                    Obj.Sessions[4] = {
                        SessionName: allGroup[i].Session5.SessionName,
                        StageEventsMark: allGroup[i].Session5.StageEventsMark,
                        OffStageEventsMark: allGroup[i].Session5.OffStageEventsMark,
                        OtherMark: 0,
                        TotalEventMark: allGroup[i].Session5.StageEventsMark + allGroup[i].Session5.OffStageEventsMark,
                    }
                    for (let a = 0; a < OtherMark.length; a++) {
                        if (OtherMark[a].TotalMark) {
                            if (allGroup[i].Session5.SessionName == OtherMark[a].SessionName) {
                                Obj.Sessions[4].OtherMark = Obj.Sessions[4].OtherMark + parseInt(OtherMark[a].TotalMark)
                                Obj.Sessions[4].TotalEventMark = Obj.Sessions[4].TotalEventMark + parseInt(OtherMark[a].TotalMark)
                            }
                        }
                    }
                }
                if (allGroup[i].Session6) {
                    if (allGroup[i].Session5.OffStageEventsMark === undefined) {
                        allGroup[i].Session5.OffStageEventsMark = 0
                    }
                    if (allGroup[i].Session5.StageEventsMark === undefined) {
                        allGroup[i].Session5.StageEventsMark = 0
                    }
                    Obj.Sessions[5] = {
                        SessionName: allGroup[i].Session6.SessionName,
                        StageEventsMark: allGroup[i].Session6.StageEventsMark,
                        OffStageEventsMark: allGroup[i].Session6.OffStageEventsMark,
                        OtherMark: 0,
                        TotalEventMark: allGroup[i].Session6.StageEventsMark + allGroup[i].Session6.OffStageEventsMark,
                    }
                    for (let a = 0; a < OtherMark.length; a++) {
                        if (OtherMark[a].TotalMark) {
                            if (allGroup[i].Session6.SessionName == OtherMark[a].SessionName) {
                                Obj.Sessions[5].OtherMark = Obj.Sessions[5].OtherMark + parseInt(OtherMark[a].TotalMark)
                                Obj.Sessions[5].TotalEventMark = Obj.Sessions[5].TotalEventMark + parseInt(OtherMark[a].TotalMark)
                            }
                        }
                    }
                }

                SessionMarkList[i] = Obj


            }

            resolve(SessionMarkList);
          
        })

    },
    getAllToppers:(FestId)=>{
        return new Promise(async(resolve, reject) => {
         let result = await db.get().collection(collection.OTHER_MARK_COLLECTION).find({FestId,Type:"Toppers"}).toArray()
        for(let i=0; i<result.length; i++){
            if(result[i].ChestNo){
                let student = await db.get().collection(collection.STUDENTS_COLLECTION).findOne({ChestNo:result[i].ChestNo})
                result[i].FullName = student.FullName,
                result[i].CicNo = student.CicNo
                result[i].Student = true
            }else if(result[i].SessionName){
                result[i].Session = true
            }else{
                result[i].Group = true
            }
            await db.get().collection(collection.GROUP_COLLECTION).findOne({FestId,GroupId:result[i].GroupId}).then((response)=>{
                result[i].GroupName = response.GroupName
            })
           
        }
         resolve(result)
          
        });
        
    },

    getEventBaiseStudentsMark: (FestId, Session, Category, EventId) => {
        return new Promise(async (resolve, reject) => {
            let Stage = await db.get().collection(collection.STUDENTS_COLLECTION).find({ FestId, "StageEvents.EventId": EventId }).toArray()
            let OffStage = await db.get().collection(collection.STUDENTS_COLLECTION).find({ FestId, "OffStageEvents.EventId": EventId }).toArray()
            let EventResult = []
            if (Stage[0]) {
                for (let i = 0; i < Stage.length; i++) {
                    for (let a = 0; a < Stage[i].StageEvents.length; a++) {
                        if (Stage[i].StageEvents[a].EventId === EventId) {
                            let GroupName = await db.get().collection(collection.GROUP_COLLECTION).findOne({ FestId, GroupId: Stage[i].GroupId })
                            GroupName = GroupName.GroupName
                            let Obj = {
                                FestId: FestId,
                                GroupId: Stage[i].GroupId,
                                GroupName: GroupName,
                                SessionName: Session,
                                ChestNo: Stage[i].ChestNo,
                                CicNo: Stage[i].CicNo,
                                FullName: Stage[i].FullName,
                                EventId: EventId,
                                Grade: Stage[i].StageEvents[a].Grade,
                                Mark: Stage[i].StageEvents[a].Mark,
                                Place: Stage[i].StageEvents[a].Place,
                                PointCategoryName: Stage[i].StageEvents[a].PointCategoryName,
                            }
                            EventResult[i] = Obj
                        }
                    }
                }
            } else if (OffStage[0]) {
                for (let i = 0; i < OffStage.length; i++) {
                    for (let a = 0; a < OffStage[i].OffStageEvents.length; a++) {
                        if (OffStage[i].OffStageEvents[a].EventId === EventId) {
                            let GroupName = await db.get().collection(collection.GROUP_COLLECTION).findOne({ FestId, GroupId: OffStage[i].GroupId })
                            GroupName = GroupName.GroupName
                            let Obj = {
                                FestId: FestId,
                                GroupId: OffStage[i].GroupId,
                                GroupName: GroupName,
                                SessionName: Session,
                                ChestNo: OffStage[i].ChestNo,
                                CicNo: OffStage[i].CicNo,
                                FullName: OffStage[i].FullName,
                                EventId: EventId,
                                Grade: OffStage[i].OffStageEvents[a].Grade,
                                Mark: OffStage[i].OffStageEvents[a].Mark,
                                Place: OffStage[i].OffStageEvents[a].Place,
                                PointCategoryName: OffStage[i].OffStageEvents[a].PointCategoryName,
                            }
                            EventResult[i] = Obj
                        }
                    }
                }
            }

            resolve(EventResult)
        })
    },

    searchEvent: (body) => {
        return new Promise(async (resolve, reject) => {
            let Session = await db.get().collection(collection.ITEM_COLLECTION).find({ FestId: body.FestId }).toArray()
            let searchResult = []
            let Items = []
            if (body.searchValue == "") {
                resolve(searchResult.empty = 0)
            } else {

                for (let i = 0; i < Session.length; i++) {
                    for (let a = 0; a < Session[i].StageItem.length; a++) {
                        let Obj = {
                            FestId: body.FestId,
                            SessionName: Session[i].SessionName,
                            Category: "Stage",
                            EventName: Session[i].StageItem[a].EventName,
                            EventId: Session[i].StageItem[a].EventId,
                            TypeOfEvent: Session[i].StageItem[a].TypeOfEvent,
                        }
                        if (Session[i].StageItem[a].Result) {
                            Obj.Result = true
                        }
                        Items.push(Obj)
                    }
                    for (let a = 0; a < Session[i].OffstageItem.length; a++) {
                        let Obj = {
                            FestId: body.FestId,
                            SessionName: Session[i].SessionName,
                            Category: "Off stage",
                            EventName: Session[i].OffstageItem[a].EventName,
                            EventId: Session[i].OffstageItem[a].EventId,
                            TypeOfEvent: Session[i].OffstageItem[a].TypeOfEvent,
                        }
                        if (Session[i].OffstageItem[a].Result) {
                            Obj.Result = true
                        }
                        Items.push(Obj)
                    }
                }
                let searchValue = body.searchValue;
                var myPattern = new RegExp('(\\w*' + searchValue + '\\w*)', 'gi');


                for (let b = 0; b < Items.length; b++) {

                    let searchName = Items[b].EventName.split(/\s/)
                    let NameString = null
                    for (let c = 0; c < searchName.length; c++) {
                        if (NameString == null) {
                            NameString = searchName[c].slice(0, searchValue.length).match(myPattern)
                        } 
                    }
                  
                    var searchId = Items[b].EventId.slice(0, searchValue.length).match(myPattern);;


                    if (NameString !== null) {
                        searchResult.push(Items[b])
                    } else if (searchId !== null) {
                        searchResult.push(Items[b])
                    }
                }
                resolve(searchResult)
            }
        })

    },

    searchStudent: (body) => {
        return new Promise(async (resolve, reject) => {
            let AllStudents = await db.get().collection(collection.STUDENTS_COLLECTION).find({ FestId: body.FestId }).toArray()
            let searchResult = []
            let Items = []
            if (body.searchValue == "") {
                resolve(searchResult.empty = 0)
            } else {

                let searchValue = body.searchValue;
                var myPattern = new RegExp('(\\w*' + searchValue + '\\w*)', 'gi');

                for (let b = 0; b < AllStudents.length; b++) {
                    var Group = await db.get().collection(collection.GROUP_COLLECTION).findOne({ FestId: body.FestId, GroupId: AllStudents[b].GroupId })
                    let searchName = AllStudents[b].FullName.split(/\s/)
                    let NameString = null
                    for (let c = 0; c < searchName.length; c++) {
                        if (NameString == null) {
                            NameString = searchName[c].slice(0, searchValue.length).match(myPattern)
                        } 
                    }
                    var searchChestNo = AllStudents[b].ChestNo.slice(0, searchValue.length).match(myPattern);
                    var searchCIC = AllStudents[b].CicNo.slice(0, searchValue.length).match(myPattern);
                   
                    let student = {}
                    student.GroupName = Group.GroupName
                    student.GroupId = Group.GroupId
                    student.SessionName = AllStudents[b].SessionName
                    student.ChestNo = AllStudents[b].ChestNo
                    student.CicNo = AllStudents[b].CicNo
                    student.FullName = AllStudents[b].FullName


                    if (NameString !== null) {
                        searchResult.push(student)
                    } else if (searchChestNo !== null) {
                        searchResult.push(student)
                    } else if (searchCIC !== null) {
                        searchResult.push(student)
                    }
                }

                resolve(searchResult)
            }
        })

    },

    getGroupOtherMarkResult: (FestId) => {
        return new Promise(async (resolve, reject) => {
            let OtherMark = await db.get().collection(collection.OTHER_MARK_COLLECTION).find({ FestId, Type: "Mark", SubType: "Group" }).toArray()
            for (let i = 0; i < OtherMark.length; i++) {
                let group = await db.get().collection(collection.GROUP_COLLECTION).findOne({ FestId, GroupId: OtherMark[i].GroupId })
                OtherMark[i].GroupName = group.GroupName
            }
            resolve(OtherMark);
        })
    },

    getSessionOtherMarkResult: (FestId) => {
        return new Promise(async (resolve, reject) => {
            let OtherMark = await db.get().collection(collection.OTHER_MARK_COLLECTION).find({ FestId, Type: "Mark", SubType: "Session" }).toArray()
            for (let i = 0; i < OtherMark.length; i++) {
                let group = await db.get().collection(collection.GROUP_COLLECTION).findOne({ FestId, GroupId: OtherMark[i].GroupId })
                OtherMark[i].GroupName = group.GroupName
            }
            resolve(OtherMark);
        })
    },

    getStudentOtherMarkResult: (FestId) => {
        return new Promise(async (resolve, reject) => {
            let OtherMark = await db.get().collection(collection.OTHER_MARK_COLLECTION).find({ FestId, Type: "Mark", SubType: "Student" }).toArray()
             
            for (let i = 0; i < OtherMark.length; i++) {
                let group = await db.get().collection(collection.GROUP_COLLECTION).findOne({ FestId, GroupId: OtherMark[i].GroupId })
                let student = await db.get().collection(collection.STUDENTS_COLLECTION).findOne({ FestId, GroupId: OtherMark[i].GroupId, ChestNo: OtherMark[i].ChestNo })
                OtherMark[i].GroupName = group.GroupName
                OtherMark[i].FullName = student.FullName
            }
            resolve(OtherMark);
        })
    },

    searchOtherMark: (body) => {
        return new Promise(async (resolve, reject) => {
            let OtherMarks = await db.get().collection(collection.OTHER_MARK_COLLECTION).find({ FestId: body.FestId, Type: "Mark" }).toArray()
            let searchResult = []
            let Items = []
            if (body.searchValue == "") {
                resolve(searchResult.empty = 0)
            } else {

                let searchValue = body.searchValue;
                var myPattern = new RegExp('(\\w*' + searchValue + '\\w*)', 'gi');

                for (let b = 0; b < OtherMarks.length; b++) {
                    let group = await db.get().collection(collection.GROUP_COLLECTION).findOne({ FestId: body.FestId, GroupId: OtherMarks[b].GroupId })
                    OtherMarks[b].GroupName = group.GroupName
                    var Title = OtherMarks[b].Title.split(/\s/)
                    let NameString = null
                    for (let c = 0; c < Title.length; c++) {
                        if (NameString == null) {
                            NameString = Title[c].slice(0, searchValue.length).match(myPattern)
                        } 
                    }
                    var GroupId = OtherMarks[b].GroupId.slice(0, searchValue.length).match(myPattern);


                    if (GroupId !== null) {
                        searchResult.push(OtherMarks[b])
                    } else if (NameString !== null) {
                        searchResult.push(OtherMarks[b])
                    }
                }

                resolve(searchResult)
            }
        })

    },

    getGroupToppersResult: (FestId) => {
        return new Promise(async (resolve, reject) => {
            let Toppers = await db.get().collection(collection.OTHER_MARK_COLLECTION).find({ FestId, Type: "Toppers", SubType: "Group" }).toArray()
            for (let i = 0; i < Toppers.length; i++) {
                let group = await db.get().collection(collection.GROUP_COLLECTION).findOne({ FestId, GroupId: Toppers[i].GroupId })
                Toppers[i].GroupName = group.GroupName
            }
            resolve(Toppers);
        })
    },

    getSessionToppersResult: (FestId) => {
        return new Promise(async (resolve, reject) => {
            let Toppers = await db.get().collection(collection.OTHER_MARK_COLLECTION).find({ FestId, Type: "Toppers", SubType: "Session" }).toArray()
            for (let i = 0; i < Toppers.length; i++) {
                let group = await db.get().collection(collection.GROUP_COLLECTION).findOne({ FestId, GroupId: Toppers[i].GroupId })
                Toppers[i].GroupName = group.GroupName
            }
            resolve(Toppers);
        })
    },

    getStudentToppersResult: (FestId) => {
        return new Promise(async (resolve, reject) => {
            let Toppers = await db.get().collection(collection.OTHER_MARK_COLLECTION).find({ FestId, Type: "Toppers", SubType: "Student" }).toArray()

            for (let i = 0; i < Toppers.length; i++) {
                let group = await db.get().collection(collection.GROUP_COLLECTION).findOne({ FestId, GroupId: Toppers[i].GroupId })
                let student = await db.get().collection(collection.STUDENTS_COLLECTION).findOne({ FestId, GroupId: Toppers[i].GroupId, ChestNo: Toppers[i].ChestNo })
                Toppers[i].GroupName = group.GroupName
                Toppers[i].FullName = student.FullName
            }
            resolve(Toppers);
        })
    },

    searchToppers: (body) => {
        return new Promise(async (resolve, reject) => {
            let Toppers = await db.get().collection(collection.OTHER_MARK_COLLECTION).find({ FestId: body.FestId, Type: "Toppers" }).toArray()
            let searchResult = []
            let Items = []
            if (body.searchValue == "") {
                resolve(searchResult.empty = 0)
            } else {

                let searchValue = body.searchValue;
                var myPattern = new RegExp('(\\w*' + searchValue + '\\w*)', 'gi');

                for (let b = 0; b < Toppers.length; b++) {
                    let group = await db.get().collection(collection.GROUP_COLLECTION).findOne({ FestId: body.FestId, GroupId: Toppers[b].GroupId })
                    Toppers[b].GroupName = group.GroupName
                    
                    var Title = Toppers[b].Title.split(/\s/)
                    let NameString = null
                    for (let c = 0; c < Title.length; c++) {
                        if (NameString == null) {
                            NameString = Title[c].slice(0, searchValue.length).match(myPattern)
                        } 
                    }
                    var GroupId = Toppers[b].GroupId.slice(0, searchValue.length).match(myPattern);


                    if (GroupId !== null) {
                        searchResult.push(Toppers[b])
                    } else if (NameString !== null) {
                        searchResult.push(Toppers[b])
                    }
                }

                resolve(searchResult)
            }
        })

    },

    GrandWinnerGroup: (FestId, sessionBaiseMarks, totalGroupMark) => {
        return new Promise(async (resolve, reject) => {
            let result = []

            // Group
            totalGroupMark = totalGroupMark.sort((a, b) => {
                return b.TotalMark - a.TotalMark;
            });
            totalGroupMark = totalGroupMark.slice(0, 5)

            for (let i = 0; i < totalGroupMark.length; i++) {

                totalGroupMark[i].Description = "This group baise grand winner result"

                if (totalGroupMark[i] === totalGroupMark[0]) {
                    totalGroupMark[i].Place = 1
                    totalGroupMark[i].Place2 = "st"
                } else if (totalGroupMark[i] === totalGroupMark[1]) {
                    totalGroupMark[i].Place = 2
                    totalGroupMark[i].Place2 = "nd"
                } else if (totalGroupMark[i] === totalGroupMark[2]) {
                    totalGroupMark[i].Place = 3
                    totalGroupMark[i].Place2 = "rd"
                } else if (totalGroupMark[i] === totalGroupMark[3]) {
                    totalGroupMark[i].Place = 4
                    totalGroupMark[i].Place2 = "th"
                } else if (totalGroupMark[i] === totalGroupMark[4]) {
                    totalGroupMark[i].Place = 5
                    totalGroupMark[i].Place2 = "th"
                }

            }
            result.Group = totalGroupMark


            // Sessions
            let Session1 = []
            let Session2 = []
            let Session3 = []
            let Session4 = []
            let Session5 = []
            let Session6 = []
            for (let i = 0; i < sessionBaiseMarks.length; i++) {
                for (let a = 0; a < sessionBaiseMarks[i].Sessions.length; a++) {
                    let Obj = {
                        GroupId: sessionBaiseMarks[i].GroupId,
                        GroupName: sessionBaiseMarks[i].GroupName,
                        SessionName: sessionBaiseMarks[i].Sessions[a].SessionName,
                        TotalMark: sessionBaiseMarks[i].Sessions[a].TotalEventMark,
                        Description: "This session baise grand winner"
                    }
                    if (a == 0) {
                        Session1.push(Obj)
                    } else if (a == 1) {
                        Session2.push(Obj)
                    } else if (a == 2) {
                        Session3.push(Obj)
                    } else if (a == 3) {
                        Session4.push(Obj)
                    } else if (a == 4) {
                        Session5.push(Obj)
                    } else if (a == 5) {
                        Session6.push(Obj)
                    }
                }

            }
            // Session1
            Session1 = Session1.sort((a, b) => {
                return b.TotalMark - a.TotalMark;
            });
            Session1 = Session1.slice(0, 5)
            // Session2
            Session2 = Session2.sort((a, b) => {
                return b.TotalMark - a.TotalMark;
            });
            Session2 = Session2.slice(0, 5)
            // Session3
            Session3 = Session3.sort((a, b) => {
                return b.TotalMark - a.TotalMark;
            });
            Session3 = Session3.slice(0, 5)
            // Session4
            Session4 = Session4.sort((a, b) => {
                return b.TotalMark - a.TotalMark;
            });
            Session4 = Session4.slice(0, 5)
            // Session5
            Session5 = Session5.sort((a, b) => {
                return b.TotalMark - a.TotalMark;
            });
            Session5 = Session5.slice(0, 5)
            // Session6
            Session6 = Session6.sort((a, b) => {
                return b.TotalMark - a.TotalMark;
            });
            Session6 = Session6.slice(0, 5)

            // Session1
            if (Session1[0]) {
                Session1[0].Place = 1
                Session1[0].Place2 = "st"
            }
            if (Session1[1]) {
                Session1[1].Place = 2
                Session1[1].Place2 = "nd"
            }
            if (Session1[2]) {
                Session1[2].Place = 3
                Session1[2].Place2 = "rd"
            }
            if (Session1[3]) {
                Session1[3].Place = 4
                Session1[3].Place2 = "th"
            }
            if (Session1[4]) {
                Session1[4].Place = 5
                Session1[4].Place2 = "th"
            }

            // Session2
            if (Session2[0]) {
                Session2[0].Place = 1
                Session2[0].Place2 = "st"
            }
            if (Session2[1]) {
                Session2[1].Place = 2
                Session2[1].Place2 = "nd"
            }
            if (Session2[2]) {
                Session2[2].Place = 3
                Session2[2].Place2 = "rd"
            }
            if (Session2[3]) {
                Session2[3].Place = 4
                Session2[3].Place2 = "th"
            }
            if (Session2[4]) {
                Session2[4].Place = 5
                Session2[4].Place2 = "th"
            }
            // Session3
            if (Session3[0]) {
                Session3[0].Place = 1
                Session3[0].Place2 = "st"
            }
            if (Session3[1]) {
                Session3[1].Place = 2
                Session3[1].Place2 = "nd"
            }
            if (Session3[2]) {
                Session3[2].Place = 3
                Session3[2].Place2 = "rd"
            }
            if (Session3[3]) {
                Session3[3].Place = 4
                Session3[3].Place2 = "th"
            }
            if (Session3[4]) {
                Session3[4].Place = 5
                Session3[4].Place2 = "th"
            }
            // Session4
            if (Session4[0]) {
                Session4[0].Place = 1
                Session4[0].Place2 = "st"
            }
            if (Session4[1]) {
                Session4[1].Place = 2
                Session4[1].Place2 = "nd"
            }
            if (Session4[2]) {
                Session4[2].Place = 3
                Session4[2].Place2 = "rd"
            }
            if (Session4[3]) {
                Session4[3].Place = 4
                Session4[3].Place2 = "th"
            }
            if (Session4[4]) {
                Session4[4].Place = 5
                Session4[4].Place2 = "th"
            }
            // Session5
            if (Session5[0]) {
                Session5[0].Place = 1
                Session5[0].Place2 = "st"
            }
            if (Session5[1]) {
                Session5[1].Place = 2
                Session5[1].Place2 = "nd"
            }
            if (Session5[2]) {
                Session5[2].Place = 3
                Session5[2].Place2 = "rd"
            }
            if (Session5[3]) {
                Session5[3].Place = 4
                Session5[3].Place2 = "th"
            }
            if (Session5[4]) {
                Session5[4].Place = 5
                Session5[4].Place2 = "th"
            }
            // Session6
            if (Session6[0]) {
                Session6[0].Place = 1
                Session6[0].Place2 = "st"
            }
            if (Session6[1]) {
                Session6[1].Place = 2
                Session6[1].Place2 = "nd"
            }
            if (Session6[2]) {
                Session6[2].Place = 3
                Session6[2].Place2 = "rd"
            }
            if (Session6[3]) {
                Session6[3].Place = 4
                Session6[3].Place2 = "th"
            }
            if (Session6[4]) {
                Session6[4].Place = 5
                Session6[4].Place2 = "th"
            }

            result.Session1 = Session1
            result.Session2 = Session2
            result.Session3 = Session3
            result.Session4 = Session4
            result.Session5 = Session5
            result.Session6 = Session6

            resolve(result)
        })
    },

    GrandWinnerStudent: (FestId, sessionBaiseMarkList) => {
        return new Promise(async (resolve, reject) => {
            let result = []
            //   Group
            let ForGroup = await db.get().collection(collection.STUDENTS_COLLECTION).find({ FestId }).toArray()
            let GroupBaise = []
            for (let i = 0; i < ForGroup.length; i++) {
                let group = await db.get().collection(collection.GROUP_COLLECTION).findOne({ FestId, GroupId: ForGroup[i].GroupId })
                let OtherMark = await db.get().collection(collection.OTHER_MARK_COLLECTION).find({ FestId, ChestNo: ForGroup[i].ChestNo, Type: "Mark" }).toArray()
                let OtherTotal = 0
                if (OtherMark[0]) {
                    for (let b = 0; b < OtherMark.length; b++) {
                        OtherTotal = OtherTotal + parseInt(OtherMark[b].TotalMark)
                    }
                }

                let Obj = {
                    GroupId: ForGroup[i].GroupId,
                    GroupName: group.GroupName,
                    SessionName: ForGroup[i].SessionName,
                    ChestNo: ForGroup[i].ChestNo,
                    CicNo: ForGroup[i].CicNo,
                    FullName: ForGroup[i].FullName,
                    TotalMark: OtherTotal
                }
                if (ForGroup[i].StageEventsMark) {
                    Obj.TotalMark = Obj.TotalMark + ForGroup[i].StageEventsMark
                }
                if (ForGroup[i].OffStageEventsMark) {
                    Obj.TotalMark = Obj.TotalMark + ForGroup[i].OffStageEventsMark
                }
                if (ForGroup[i].GeneralStageEventsMark) {
                    Obj.TotalMark = Obj.TotalMark + ForGroup[i].GeneralStageEventsMark
                }
                if (ForGroup[i].GeneralOffStageEventsMark) {
                    Obj.TotalMark = Obj.TotalMark + ForGroup[i].GeneralOffStageEventsMark
                }
                GroupBaise.push(Obj)
            }
            GroupBaise = GroupBaise.sort((a, b) => {
                return b.TotalMark - a.TotalMark;
            });
            GroupBaise = GroupBaise.slice(0, 5)

            if (GroupBaise[0]) {
                GroupBaise[0].Place = 1
                GroupBaise[0].Place2 = "st"
            }
            if (GroupBaise[1]) {
                GroupBaise[1].Place = 2
                GroupBaise[1].Place2 = "nd"
            }
            if (GroupBaise[2]) {
                GroupBaise[2].Place = 3
                GroupBaise[2].Place2 = "rd"
            }
            if (GroupBaise[3]) {
                GroupBaise[3].Place = 4
                GroupBaise[3].Place2 = "th"
            }
            if (GroupBaise[4]) {
                GroupBaise[4].Place = 5
                GroupBaise[4].Place2 = "th"
            }
            result.Group = GroupBaise

            // Session

            for (let i = 0; i < sessionBaiseMarkList[0].Sessions.length; i++) {

                let ForSession = await db.get().collection(collection.STUDENTS_COLLECTION).find({ FestId, SessionName: sessionBaiseMarkList[0].Sessions[i].SessionName }).toArray()
                if (ForSession) {
                    let SessionBaise = []
                    for (let a = 0; a < ForSession.length; a++) {
                        let group = await db.get().collection(collection.GROUP_COLLECTION).findOne({ FestId, GroupId: ForSession[a].GroupId })
                        let OtherMark = await db.get().collection(collection.OTHER_MARK_COLLECTION).find({ FestId, ChestNo: ForSession[a].ChestNo, Type: "Mark" }).toArray()
                        let OtherTotal = 0
                        if (OtherMark[0]) {
                            for (let b = 0; b < OtherMark.length; b++) {
                                OtherTotal = OtherTotal + parseInt(OtherMark[b].TotalMark)
                            }
                        }
                        let Obj = {
                            GroupId: ForSession[a].GroupId,
                            GroupName: group.GroupName,
                            SessionName: ForSession[a].SessionName,
                            ChestNo: ForSession[a].ChestNo,
                            CicNo: ForSession[a].CicNo,
                            FullName: ForSession[a].FullName,
                            TotalMark: OtherTotal
                        }

                        if (ForSession[a].StageEventsMark) {
                            Obj.TotalMark = Obj.TotalMark + ForSession[a].StageEventsMark
                        }
                        if (ForSession[a].OffStageEventsMark) {
                            Obj.TotalMark = Obj.TotalMark + ForSession[a].OffStageEventsMark
                        }
                        if (ForSession[a].GeneralStageEventsMark) {
                            Obj.TotalMark = Obj.TotalMark + ForSession[a].GeneralStageEventsMark
                        }
                        if (ForSession[a].GeneralOffStageEventsMark) {
                            Obj.TotalMark = Obj.TotalMark + ForSession[a].GeneralOffStageEventsMark
                        }
                        SessionBaise.push(Obj)
                    }
                    SessionBaise = SessionBaise.sort((a, b) => {
                        return b.TotalMark - a.TotalMark;
                    });
                    SessionBaise = SessionBaise.slice(0, 5)


                    if (SessionBaise[0]) {
                        SessionBaise[0].Place = 1
                        SessionBaise[0].Place2 = "st"
                    }
                    if (SessionBaise[1]) {
                        SessionBaise[1].Place = 2
                        SessionBaise[1].Place2 = "nd"
                    }
                    if (SessionBaise[2]) {
                        SessionBaise[2].Place = 3
                        SessionBaise[2].Place2 = "rd"
                    }
                    if (SessionBaise[3]) {
                        SessionBaise[3].Place = 4
                        SessionBaise[3].Place2 = "th"
                    }
                    if (SessionBaise[4]) {
                        SessionBaise[4].Place = 5
                        SessionBaise[4].Place2 = "th"
                    }

                    if (i == 0) {
                        result.Session1 = SessionBaise
                    } else if (i == 1) {
                        result.Session2 = SessionBaise
                    } else if (i == 2) {
                        result.Session3 = SessionBaise
                    } else if (i == 3) {
                        result.Session4 = SessionBaise
                    } else if (i == 4) {
                        result.Session5 = SessionBaise
                    } else if (i == 5) {
                        result.Session6 = SessionBaise
                    }
                }
            }

           


            resolve(result)
        })

    },

    resultFullStatus: (FestId) => {
        return new Promise(async (resolve, reject) => {
            let result = []
            let allItems = await db.get().collection(collection.ITEM_COLLECTION).find({ FestId }).toArray()
            for (let i = 0; i < allItems.length; i++) {
                let Obj = {
                    FestId,
                    SessionName: allItems[i].SessionName,
                    TotalEvents: 0,
                    Published: 0,
                    Pending: 0,
                    Percentage: 0
                }
                let FullItem = []
                for (let a = 0; a < allItems[i].StageItem.length; a++) {
                    FullItem.push(allItems[i].StageItem[a])
                }
                for (let a = 0; a < allItems[i].OffstageItem.length; a++) {
                    FullItem.push(allItems[i].OffstageItem[a])
                }

                Obj.TotalEvents = FullItem.length
                for (let b = 0; b < FullItem.length; b++) {
                    if (FullItem[b].Result) {
                        Obj.Published = Obj.Published + 1
                    } else {
                        Obj.Pending = Obj.Pending + 1
                    }
                }
                Obj.Percentage = (Obj.Published / Obj.TotalEvents) * 100
                // cut after dot
                var a = Obj.Percentage.toString()
                if (a === "NaN") {
                    a = "0"
                }
                var num = a.indexOf(".");
                if (num == -1) {
                    Obj.Percentage = a
                } else {
                    Obj.Percentage = a.slice(0, num)
                }
              
                result.push(Obj)

            }
            resolve(result)
        })
    }

}