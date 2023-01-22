const userHelpers = require('../helpers/user-helpers')
const groupHelpers = require('../helpers/group-helpers')

const verifyActiveFest = async (req, res, next) => {
    let activeFest = await userHelpers.activeFest()
    let activeResult = await userHelpers.activeResult()
    if (activeFest) {
        if (activeResult) {
            if (req.session.user.FestId == activeFest.FestId) {
                next()
            } else {
                res.redirect('/')
            }
        } else {
            res.redirect('/')
        }
    } else {
        res.redirect('/')
    }
};

const verifyGroupLogin = async (req, res, next) => {

    if (req.session.group) {
        let Group = req.session.group
        let GroupDetails = await groupHelpers.getGroupDetails(Group.GroupId, Group.FestId)

        if (GroupDetails === undefined) {
            req.session.group = null
            res.redirect('/group/login')
        } else {
            next()
        }
    } else {
        res.redirect('/group/login')
    }
};

const verifyAdminLogin = (req, res, next) => {
    if (req.session.admin) {
        next()
    } else {
        res.redirect('/fest-admin/login')
    }
};

const verifyFestLogin = (req, res, next) => {
    if (req.session.fest) {
        next()
    } else {
        res.redirect('/fest-admin')
    }
};


module.exports = { verifyActiveFest, verifyGroupLogin, verifyAdminLogin, verifyFestLogin }