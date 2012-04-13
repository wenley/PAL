//  Author: Wenley Tong
//  Written: 10 April 2012
//  pageConnection.js

//  Establishes the interface between the background page and content scripts
//  using requests

function testConnection() {
   chrome.tabs.getCurrent(function (tab) { console.log(tab.id); });
}


function refreshCourses() {
   return;
}

//  Calls toDo on the array of Courses
function getCourses(toDo) {
   chrome.tabs.getCurrent(function (tab) {
         chrome.tabs.sendRequest(tab.id, {desire: "Courses"}, function(response) {
               toDo(response.gift);
            });
      });
}

//  Will route requests from content scripts to proper functions
function handleMessage(msg) {
   console.log("Successful re-route of request!");
   console.log("Request contents:");
   for (var entry in msg) {
      console.log(entry + ": ");
      console.log(Object.prototype.toString.apply(msg));
      console.log(Object.prototype.toString.apply(msg[entry]));
      console.log(msg[entry]);
      console.log(Object.prototype.toString.apply(msg[entry][0]));
   }
   return {response: "No message from the background"};
}


//  Handles requests from the content scripts
chrome.extension.onConnect.addListener(function(port) {
      console.log(port);
      port.onMessage.addListener(function(msg) {
            console.log("Content is asking for something...");
            var response = handleMessage(msg);
            console.log("Getting out of background handler");
            port.postMessage(response);
         });
   });

