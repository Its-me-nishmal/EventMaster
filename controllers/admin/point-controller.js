const eventHelpers = require('../../helpers/event-helpers')


const getPointsPage = async (req, res) => { ////
    const Event = req.session.event
    const Points = await eventHelpers.getPoints(Event.EventId)
    if (req.session.Error) {
        res.render('event/points/point-table', {
            "Error": req.session.Error,
            title: Event.Name, eventHeader: true, createAccout: true, adminHeader: true, Event,
            Points
        })
        req.session.Error = false
    } else {
        res.render('event/points/point-table', {
            title: Event.Name, eventHeader: true, createAccout: true, adminHeader: true, Event,
            Points
        })
    }

}

const getAddPoints = (req, res) => { ////
    const Event = req.session.event
    res.render('event/points/add-pointTable', { title: Event.Name, eventHeader: true, createAccout: true, adminHeader: true, Event })
}

const postAddPoints = (req, res) => { ////
    const Event = req.session.event
    eventHelpers.addPoints(req.body).then((response) => {

        if (response) {

            req.session.Error = "This category already exisits"
            res.redirect('/event/' + Event.EventId + '/points')
        } else {
            res.redirect('/event/' + Event.EventId + '/points')
        }
    })
}

const deletePoint = (req, res) => { ////
    const EventId = req.params.EventId
    const categoryName = req.params.categoryName
    eventHelpers.deletePoint(EventId, categoryName).then((event) => {
        if (event) {
            req.session.Error = "A few events have been added to this category, delete the event first"
            res.redirect('/event/' + EventId + '/points')

        } else {

            res.redirect('/event/' + EventId + '/points')
        }
    })
}


module.exports = {
    getPointsPage, getAddPoints, postAddPoints, deletePoint,
}