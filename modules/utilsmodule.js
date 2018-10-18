// JavaScript source code
// Utils file
var methods = {};
var fs = require('fs');

methods.getRandomInt = function(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

methods.listArrayItems = function(a){
	var output = "";
	for(var i = 0; i < a.length; i++){
		output = output + "    `" + a[i] + '`\n';
	}
	return output;
}

methods.getTime = function(){
	var date = new Date();
	var year = date.getUTCFullYear();
	var month = date.getUTCMonth();
	var day = date.getUTCDate();
	var hour = date.getUTCHours();
	var minute = date.getUTCMinutes();
	var second = date.getUTCSeconds();
	var mili = date.getUTCMilliseconds();
	return (year + "-" + month + "-" + day + "-" + hour + ":" + minute + ":" + second + ":" + mili);
}

methods.logMsg = function(msg){
	console.log(methods.getTime() + " " + msg);
}

methods.sendMessageWithTryCatch = function(destination, messageContent) {
    try {
        destination.send(messageContent).catch(console.error);
    } catch (err) {
        console.log("Error: \n" + err + "\n\nSending message:\n" + messageContent);
    }
}

module.exports = methods;