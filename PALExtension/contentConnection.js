//  Author: Wenley Tong
//  Written: 10 April 2012
//  contentConnection.js
//
//  Establishes interface between content scripts and background page
//  using requests

var port = chrome.extension.connect({name: "Greetings"});
port.postMessage({letter: "Hello!"});
port.onMessage.addListener(function(msg) {
      console.log("Background is asking for something...");
      console.log("Message contents: ");
      for (var entry in msg) {
         console.log(entry);
      }
      console.log("Getting out");
   });


//  Stores the compiled history of courses to the background
function pushCourses() {
   chrome.extension.sendRequest({gift: Courses}, function(response) {
         console.log("Successful push to background?");
         console.log("Response contents: ");
         for (var entry in response) {
            console.log(entry);
         }
      });
}

function testPush() {
   console.log("Attempt test push...");
   port.postMessage({letter: "This is a test"});
}