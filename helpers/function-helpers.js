
function createRandomId(sting_length, addition = "", type = null) {   
    const symbolWord = '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*-=/?.,'
    const nomal = '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const number = '123456789'
    let randomString = '';
    let numbers = type === 'number' ? number : type === 'symbol' ? symbolWord : nomal
    for (let i = 0; i < sting_length; i++) {
        randomString += numbers.charAt(Math.floor(Math.random() * numbers.length))
    }
    return addition + randomString
}

function convertDateToNormal(date, iso = false) {

    let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let Year = parseInt(date.slice(0, 4))
    let Month = parseInt(date.slice(5, 7))
    let Day = parseInt(date.slice(8, 10))
    data.FestDate = Day + " - " + monthNames[Month - 1] + " - " + Year
}

module.exports = { createRandomId, convertDateToNormal }