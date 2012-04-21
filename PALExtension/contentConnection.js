//  Author: Wenley Tong
//  Written: 10 April 2012
//  contentConnection.js
//
//  Establishes interface between content scripts and background page
//  using requests

var port = chrome.extension.connect({name: "Content to Backround"});
port.postMessage({note: "Hello!"});
port.onMessage.addListener(function(msg) {
      var response = handleMessage(msg);
      if (response != null)
         port.postMessage(response);
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
            console.log("Got old version of courses!");
            console.log(Courses);
            var reMine = setTimeout(mineBB, 300000); //  5 minutes
            copyFromBackground();
            console.log(Courses.S2012.PHY106.syllabusDoc.toHTML);
         }
         response = null;
         break;
      case "template":
         if (msg.template == undefined || msg.template == null)
            console.warn("Empty txemplate body from background");
         else
            clearPage(msg.template);
         response = null;
         break;
      case "update": //  Indicates difference; need to update page
         console.log("Not handling updates yet.");
         response = null;
         break;
      default:
         console.log("Unknown note from background: " + msg.note);
         response = null;
         break;
   }

   return response;
}

//  Stores the compiled history of courses to the background
function pushCourses() {
   console.log("Attempt to push courses to background...");
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