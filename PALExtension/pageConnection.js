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
function handleRequest(request) {
   console.log("Successful re-route of request!");
   console.log("Request contents:");
   for (var entry in request) {
      console.log(entry);
   }
   return {response: "No message from the background"};
}


//  Handles requests from the content scripts
chrome.extension.onConnect.addListener(function(port) {
      console.log(port);
      port.onMessage.addListener(function(msg) {
            console.log("Content is asking for something...");
            console.log("Message contents: ");
            for (var entry in msg) {
               console.log(entry);
            }
            console.log("Getting out of background handler");
         });
   });

