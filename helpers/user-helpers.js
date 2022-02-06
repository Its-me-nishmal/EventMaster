var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
var ObjectId = require('mongodb').ObjectId;
const { reject, resolve, all } = require('promise')
const { response } = require('express')

module.exports = {

    activeFest:()=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collection.FEST_COLLECTION).findOne({userStatus:1}).then((response)=>{
                resolve(response)
            })
        })
        
    },
    activeResult:()=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collection.FEST_COLLECTION).findOne({resultStatus:1}).then((response)=>{
                resolve(response)
            })
        })
        
    },

   
    searchStudentEvent: (body) => {
        console.log('iiii');
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
                    var searchName = AllStudents[b].FullName.match(myPattern);
                    var searchChestNo = AllStudents[b].ChestNo.match(myPattern);
                    var searchCIC = AllStudents[b].CicNo.match(myPattern);
                    //
                    let student = {}
                    student.GroupName = Group.GroupName
                    student.GroupId = Group.GroupId
                    student.SessionName = AllStudents[b].SessionName
                    student.ChestNo = AllStudents[b].ChestNo
                    student.CicNo = AllStudents[b].CicNo
                    student.FullName = AllStudents[b].FullName


                    if (searchName !== null) {
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

   

}