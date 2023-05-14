
function createRandomId(sting_length, addition = "", type = null) {
    const symbolWord = '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*-=/?.,'
    const nomal = '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const number = '123456789'
    let randomString = '';
    let numbers = type === 'number' ? number : type === 'symbol' ? symbolWord : nomal
    for (var i, i = 0; i < sting_length; i++) {
        randomString += numbers.charAt(Math.floor(Math.random() * numbers.length))
    }
    return addition + randomString
}

module.exports = { createRandomId }