const groupHelpers = require("../../helpers/group-helpers")


const getMainPage = async (req, res) => {////
    let Group = req.session.group
    res.render('group/other/main-page', { title: Group.GroupName, group: true, groupHeader: true, Group })
}

const getChangePasswordPage = async (req, res) => {////
    let Group = req.session.group

    if (req.session.Success) {
        res.render('group/other/change-password', { title: Group.GroupName, group: true, groupHeader: true, Group, "Success": req.session.Success })
        req.session.Success = false
    } else if (req.session.Error) {
        res.render('group/other/change-password', { title: Group.GroupName, group: true, groupHeader: true, Group, "Error": req.session.Error })
        req.session.Error = false
    } else {
        res.render('group/other/change-password', { title: Group.GroupName, group: true, groupHeader: true, Group })
    }
}

const postChangePassword = (req, res) => {////
    groupHelpers.changePassword(req.body).then((response) => {
      if (response) {
        req.session.Success = "Password Changed"
        res.redirect('/group/change-password')
      } else {
        req.session.Error = "Invalid Current password"
        res.redirect('/group/change-password')
      }
    })
  }

  const fetchData = (req, res) => {////
    groupHelpers.fetchData(req.body).then((result) => {
      if (result) {
        req.session.group = null
        req.session.group = result
        console.log(result);
        res.json(result)
      } else {
        res.redirect('/group/login')
      }
    })
  }

module.exports = { getMainPage, getChangePasswordPage, postChangePassword, fetchData }