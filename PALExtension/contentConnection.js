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
            console.warn("Empty template body from background");
         else
            clearPage(msg.template);
         populate();
         response = null;
         break;
      case "update": //  Indicates difference; need to update page
         handleUpdate(msg.update);
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

            if (msg.template == undefined || msg.template == null)
               copyFromBackground();
            else {
               clearPage(msg.template);
               populate(msg.state);
            }
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

//  Deals with diff updates
function handleUpdate(diffString) {
   if (diffString.length == 0)
      return;
   var semDiffs = diffString.split('/');
   for (var i = 0; i < semDiffs.length; i++) {
      var split1 = semDiffs[i].split("'");
      var sem = split1[0];
      var courseDiffs = split1[1].split(';');
      for (var j = 0; j < courseDiffs.length; j++) {
         var split2 = courseDiffs[j].split(':');
         var courseKey = split2[0];
         var attrDiffs = split2[1].split(',');
         for (var k = 0; k < attrDiffs.length; k++) {
            var attr = attrDiffs[k];
            console.log("Diff in " + sem + ": " + courseKey + ": " + attr);
         }
      }
   }  
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

//  Saves the current user state to the background
function saveState() {
   if (selectedSemName != null &&
       selectedCourse != null &&
       selectedTab != null) {
   port.postMessage({
        note: "state",
        state: {
           semester: selectedSemName,
           course: selectedCourse.key,
           tab: selectedTab.parentElement.parentElement.parentElement.getAttribute("attribute")
        }
   });
   }
}
