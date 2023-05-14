const eventHelpers = require("../../helpers/event-helpers")

const getHomePage = async (req, res) => {
    const allEvents = await eventHelpers.allEvents()
    console.log(allEvents);
    res.render('user/home/main-page', { title: 'NSA Online', allEvents, footer: true })
}

module.exports = { getHomePage }