const restify = require('restify');
const botbuilder = require('botbuilder');
const fetch = require('node-fetch');

// Create HTTP server.
let server = restify.createServer();
const port = process.env.port || process.env.PORT || 3978
server.listen(port, function () {
    console.log(`Server listening at URL: http://localhost:${port}/api/messages`);
});
 
// Create bot adapter, which defines how the bot sends and receives messages.
var adapter = new botbuilder.BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});
 
// Listen for incoming requests at /api/messages.
server.post('/api/messages', (req, res) => {
    // Use the adapter to process the incoming web request into a TurnContext object.
    adapter.processActivity(req, res, async (turnContext) => {

        // Do something with this incoming activity!
        if (turnContext.activity.type === 'message') {            
            // Get the user's text
            let message = turnContext.activity.text;

            let response = await fetch(`https://centralindia.api.cognitive.microsoft.com/text/analytics/v2.1/sentiment`, {
                method : 'POST',
                body: JSON.stringify( {            
                    documents:[{id:'1', language: 'en', text:message}]  
                 }),
                headers : {
                    'Ocp-Apim-Subscription-Key' : '27341f211bdf4c68ad2997dc9229b2bd',
                    'Content-Type':'application/json', 
                    'Accept':' application/json',
                }
            })

            let data = await response.json();
            let returnMessage= ''

            if(data.documents[0].score > 0.80) {       // happy  
                returnMessage = `😊😊😊`            
            } 
            else if(data.documents[0].score > 0.1) {   // stressed    
                returnMessage = `😥😥😥`              
            } 
            else {                                     // crisis  
                returnMessage = `😔😔😔`               
            } 
           
            console.log(data.documents[0].score)
            await turnContext.sendActivity(returnMessage)
        }
    })

});




