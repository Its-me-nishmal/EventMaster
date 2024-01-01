const eventHelpers = require("../../helpers/event-helpers");

const getHomePage = async (req, res) => {
    try {
        // Call the allEvents function from the eventHelpers module
        const allEvents = await eventHelpers.allEvents();

        // Check if allEvents is null or undefined
        if (allEvents == null) {
            // If allEvents is null, render a different view or handle it accordingly
            return res.render('user/home/main-page', { title: 'NSA Online', footer: true });
        }

        // Render the 'main-page' view with the list of events
        res.render('user/home/main-page', { title: 'NSA Online', allEvents, footer: true });
    } catch (error) {
        // Handle other errors that might occur during the execution of the function
        console.error('Error fetching events:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = { getHomePage };
