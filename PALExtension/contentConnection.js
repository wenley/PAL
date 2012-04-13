//  Author: Wenley Tong
//  Written: 10 April 2012
//  contentConnection.js
//
//  Establishes interface between content scripts and background page
//  using requests

var port = chrome.extension.connect({name: "Content to Backround"});
port.postMessage({letter: "Hello!"});
port.onMessage.addListener(function(msg) {
      console.log("Background is asking for something...");
      console.log("Message contents: ");
      for (var entry in msg) {
         console.log(entry + ": " + msg[entry]);
      }
      console.log("Getting out");
   });


//  Stores the compiled history of courses to the background
function pushCourses() {
    console.log("Attempt to push courses to background...");
    port.postMessage({gift: Courses}, function(response) {
          console.log("Successful push to background?");
          console.log("Response contents: ");
          for (var entry in response) {
             console.log(entry + ": " + response[entry]);
          }
       });
}

function testPush() {
   console.log("Attempt test push...");
   port.postMessage({letter: "This is a test"});
}