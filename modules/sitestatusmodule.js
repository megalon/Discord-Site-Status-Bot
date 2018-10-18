
const Discord = require("discord.js");
var utilCommands = require("./utilsmodule.js");

var methods = {};

var statusUP = "✅";
var statusDOWN = "❌";
var statusUNKOWN = "❔";

methods.getSiteStatusMessage = async (urlInput, msg) => {

	var url = methods.padLink(urlInput);

	utilCommands.logMsg("Attempting to get status for " + url);

	var result = "";
	var status = statusUNKOWN;
	var iconURL = "https://discordapp.com/assets/cef2d5ab02888e885953f945f9c39304.svg";
 
	methods.getSiteStatus(url)
	.then(function(statusCode){

		console.log(result);
	
		if(statusCode == null){
			result = "I could not understand that url:\n`" + url + "`";
		}else if (statusCode === 200 || statusCode === 304) {
			status  = statusUP;
			iconURL = "https://discordapp.com/assets/c6b26ba81f44b0c43697852e1e1d1420.svg";
			result += "`" + url + "`\nAppears to be **UP**"
		}else if(statusCode === 404 || statusCode === 502){
			status  = statusDOWN;
			iconURL = "https://discordapp.com/assets/b1868d829b37f0a81533ededb9ffe5f4.svg";
			result += "`" + url + "`\nAppears to be **DOWN**\nResponse status code: `" + response.statusCode + "`";
		}else{
			result = "`" + url + "`\nRecieved status code: `" + response.statusCode + "`";
		}
			
		let embed = new Discord.RichEmbed()
		.setTitle(`STATUS ${status}`)
		.setThumbnail(iconURL)
		.setDescription(result)
		.setTimestamp()
		.setColor(status === statusUP ? "GREEN" : "RED");
		
		msg.channel.send({embed})
	})
}

// Make sure link is in proper format https://www.whatever.xyz
methods.padLink = function(urlInput){
	var url = "";
	var numPeriods = (urlInput.match(/\./g) || []).length;

	//console.log("numPeriods: " + numPeriods);

	if(numPeriods == 0){
		url = "https://www." + urlInput + ".com";
	}else if(numPeriods == 1){
		// example.com
		if(urlInput.substring(0, 4) === "http"){
			// http://ex.ample.com
			// https://www.example.com
			url = urlInput;
		}else{
			url = "https://www." + urlInput;
		}
	}else if(numPeriods == 2){
		// ex.ample.com
		// console.log("urlInput.substring(0, 4): " + urlInput.substring(0, 4));
		if(urlInput.substring(0, 4) === "http"){
			// http://ex.ample.com
			// https://www.example.com
			url = urlInput;
		}else{
			// ex.ample.com
			url = "https://" + urlInput;
		}
	}else{
		url = urlInput;
	}

	return url;
}

methods.getSiteStatus = async (url) => {

	var request = require("request");
	return new Promise(function(resolve, reject) {
		request(url, function (error, response, body) {
			resolve(error ? null : response.statusCode);
		});
	});
}

module.exports = methods;