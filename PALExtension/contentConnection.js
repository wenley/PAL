//  Author: Wenley Tong
//  Written: 10 April 2012
//  contentConnection.js
//
//  Establishes interface between content scripts and background page
//  using requests

var port = chrome.extension.connect({name: "Content to Backround"});
port.onMessage.addListener(function(msg) {
      var response = handleMessage(msg);
      if (response != null)
         port.postMessage(response);
   });
port.onDisconnect.addListener(function() {
      port.post = function() { console.log("Dead port. Reload to try again."); };
   });


//  Will route requests from background to proper functions
function handleMessage(msg) {
   if (msg.error != undefined) {
      console.warn("ERROR: " + msg.error);
      return null;
   }

   var response;
   switch (msg.note) {
      case "good": //  Indicates proper push
         response = null;
         break;
      case "courses": //  Indicates response to pull
         Courses = restorePrototype(msg.courses);
         if (Courses == null) {
            mineBB();
         }
         else {
            console.log(Courses);
            var reMine = setTimeout(mineBB, 300000); //  !!! 5 minutes, should be semi-instant
            copyFromBackground();
         }
         response = null;
         break;
      case "template":
         if (msg.template == undefined || msg.template == null)
            console.warn("Empty txemplate body from background");
         else
            clearPage(msg.template);
         populate();
         response = null;
         break;
      case "update": //  Indicates difference; need to update page
         console.log("Not handling updates yet.");
         response = null;
         break;
      case "cleared":
         document.location.href = document.location.href;
         response = null;
      case "loaded": // Indicates response to user-specific pull
         Courses = restorePrototype(msg.courses);
         if (Courses == null) {
            mineBB();
         }
         else {
            console.log(Courses);
            var reMine = setTimeout(mineBB, 300000); //  !!! 5 minutes, should be semi-instant
            copyFromBackground();
         }
         response = null;
         break;
      default:
         console.warn("Unknown note from background: " + msg.note);
         response = null;
         break;
   }

   return response;
}

//  Stores the compiled history of courses to the background
function pushCourses() {
   port.postMessage({note: "push", courses: Courses});
}

//  Updates a single course in background
function pushCourse(c) {
   port.postMessage({note: "pushSingle", course: c});
}

//  Start attempt to get courses
function pullCourses() {
   port.postMessage({note: "pull"});
}

//  Gets template from background
function copyTemplate() {
   port.postMessage({note: "template"});
}

//  Starts a completely new mining sequence
function refresh() {
   port.postMessage({note: "clear"});
}
