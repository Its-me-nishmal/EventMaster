const groupHelpers = require('../../helpers/group-helpers')

// Auth
const getLogin = (req, res) => {////
    if (req.session.group) {
        res.redirect('/group')
    } else if (req.session.Error) {
        res.render('group/auth/login', { title: 'Group login', groupHeader: true, "Error": req.session.Error })
        req.session.Error = false
    } else {
        res.render('group/auth/login', { title: 'Group login', groupHeader: true, })
    }
}

const postLogin = (req, res) => {////
    groupHelpers.doLogin(req.body).then((response) => {
        if (response?.GroupId) {
            req.session.group = response
            res.redirect('/group')
        } else if (response?.Error) {
            req.session.Error = response.Error
            res.redirect('/group/login')
        }
    })
}

const getLogOut = (req, res) => {////
    req.session.group = null
    res.redirect('/group/login')
}

module.exports = {
    getLogin, postLogin, getLogOut
}