var express = require('express');
var router = express.Router();
const userHelpers = require('../helpers/user-helpers');
var festHelpers = require('../helpers/fest-helpers');

/* GET home page. */
router.get('/', async function (req, res, next) {
  let activeFest = await userHelpers.activeFest()

  if (activeFest) {
    let activeFestGroups = await festHelpers.getAllGroups(activeFest.FestId)
    res.render('user/home', { title: "NSA Online", activeFest, activeFestGroups });
  } else {
    res.render('user/home', { title: "NSA Online" });
  }
});


module.exports = router;
