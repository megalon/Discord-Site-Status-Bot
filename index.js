    // JavaScript source code
const Discord = require('discord.js');
const settings = require("./settings/settings.json");
var siteStatusModule = require("./modules/sitestatusmodule.js");
var utilsModule = require("./modules/utilsmodule.js");

const siteCheckInterval = 60000;
var guildID = settings.guild;
var clientURLsAndTokens = settings.clientURLsAndTokens;
var readyCounter = 0;

/*
Contents of object
    client: The Discord client object
    url:    The url that this bot should be watching
    title:  The name of the bot
*/
var clientUrlObjects = [];

utilsModule.logMsg("clientURLsAndTokens:\n" + clientURLsAndTokens);

// Create the array of clientUrlObjects
for(var i = 0; i < clientURLsAndTokens.length; ++i){

    utilsModule.logMsg("Creating a discord client for: " + clientURLsAndTokens[i].url);

    clientUrlObjects.push({client: new Discord.Client(), url: clientURLsAndTokens[i].url, title: clientURLsAndTokens[i].title});

    var obj = clientUrlObjects[i];

    obj.client.login(clientURLsAndTokens[i].token);

    obj.client.on('ready', () => {
        utilsModule.logMsg("+++++++++++++ Client " + readyCounter + " is ready! +++++++++++++");
        readyCounter++;

        if(readyCounter == clientURLsAndTokens.length){
            setUsernames();
        }
    });
	
	// This is supposed to fix the bot crashing on disconnection from the internet
	obj.client.on('error', console.error);
}

setInterval(function(){
    if(guildID == null)
        return;

    if(clientUrlObjects.length == 0){
        utilsModule.logMsg("Clients array is null. Returning...");
        return;
    }
    for(c of clientUrlObjects){
        if(c == null)
            continue;
        setStatus(c.url, c.client);
    }
    console.log("-----------------------------------");
    
}, siteCheckInterval);

function setStatus(url, clientObj){
    var paddedUrl = siteStatusModule.padLink(url);

    utilsModule.logMsg("Checking status of URL: " + paddedUrl);

    siteStatusModule.getSiteStatus(paddedUrl)
    .then(function(statusCode){
        utilsModule.logMsg("Status for " + url + " is: " + statusCode);

        var presence = statusCode == 200 ? 'invisible' : 'dnd';
        utilsModule.logMsg(presence);

        // Set the client user's presence
        clientObj.user.setPresence({game: { type: 'watching' , name: url}, status: presence })
          .catch(console.error);
    });
}

function setUsernames(){
    for(clientObj of clientUrlObjects){
        utilsModule.logMsg("Attempting to set nickname to " + clientObj.title);

        var guild = null;
        for(g of clientObj.client.guilds.array()){
            if(g.id == guildID){
                utilsModule.logMsg("Found guild " + guildID);
                guild = g;
            }
        }
        utilsModule.logMsg("Exited loop....");

        if(guild != null){
            // Fetch a guild member
            utilsModule.logMsg("Fetching client member from user id: " + clientObj.client.user.id);
            guild.fetchMember(clientObj.client.user.id)
            .then(member =>{

                // Can't believe I have to do this AGAIN just to avoid async issues
                for(cObj of clientUrlObjects){
                    if(cObj.client.user.id == member.id){
                        utilsModule.logMsg("Setting username " + cObj.title + "\nFor member id: " + member.id);
                        member.setNickname(cObj.title);
                    }
                }
            })
            .catch(console.error);
        }
    }
}