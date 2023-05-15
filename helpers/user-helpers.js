const db = require('../config/db')
const collection = require('../config/collections')


module.exports = {

    activeFest: () => {
        return new Promise((resolve, reject) => {
            try {
                db.get().collection(collection.EVENT_COLLECTION).findOne({ userStatus: 1 }).then((response) => {
                    resolve(response)
                })
                
            } catch (error) {
                throw error;
            }
        })

    },
    activeResult: () => {
        return new Promise((resolve, reject) => {
            try {
                db.get().collection(collection.EVENT_COLLECTION).findOne({ resultStatus: 1 }).then((response) => {
                    resolve(response)
                })
                
            } catch (error) {
                throw error;
            }
        })

    },


    searchStudentEvent: (body) => {
        
        return new Promise(async (resolve, reject) => {
            try {
                
                let AllStudents = await db.get().collection(collection.STUDENTS_COLLECTION).find({ FestId: body.FestId }).toArray()
                let searchResult = []
                let Items = []
                if (body.searchValue == "") {
                    resolve(searchResult.empty = 0)
                } else {
    
                    let searchValue = body.searchValue;
                    const myPattern = new RegExp('(\\w*' + searchValue + '\\w*)', 'gi');
    
                    for (let b = 0; b < AllStudents.length; b++) {
                        const Group = await db.get().collection(collection.GROUP_COLLECTION).findOne({ FestId: body.FestId, GroupId: AllStudents[b].GroupId })
                       
                        let searchName = AllStudents[b].FullName.split(/\s/)
                        let NameString = null
                        for (let c = 0; c < searchName.length; c++) {
                            if (NameString == null) {
                                NameString = searchName[c].slice(0, searchValue.length).match(myPattern)
                            } 
                        }
                        const searchChestNo = AllStudents[b].ChestNo.slice(0, searchValue.length).match(myPattern);
                        const searchCIC = AllStudents[b].CicNo.slice(0, searchValue.length).match(myPattern);
                        
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
            } catch (error) {
                throw error;
            }
        })

    },



}