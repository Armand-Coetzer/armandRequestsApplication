const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {
    const { Requests } = this.entities;

    // Define the POST handler for Requests entity to create a new request
    this.on('CREATE', Requests, async (req) => {
        const { shortDescription, description, priority } = req.data;

        // Perform the necessary data validation and database insertion
        const newRequest = {
            shortDescription,
            description,
            priority,
            archived: false 
        };

        const result = await INSERT.into(Requests).entries(newRequest);

        return result;
    });

    // Define the GET handler for Requests entity to fetch all requests
    this.on('READ', Requests, async () => {
        return SELECT.from(Requests);
    });

    // Define the PUT handler for Requests entity to update an existing request
    this.on('UPDATE', Requests, async (req) => {
        const { ID, shortDescription, description, priority } = req.data;

        // Perform the necessary data validation and database update
        const updatedRequest = {
            shortDescription,
            description,
            priority,
            archived: false // Assuming a default value for archived field
        };

        const result = await UPDATE(Requests).set(updatedRequest).where({ ID });

        return result;
    });
});
