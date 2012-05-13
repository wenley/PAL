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
      port.postMessage = function() { 
         console.warn("Dead port. Reload to try again.");
      };
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
            var reMine = setTimeout(mineBB, 60000); //  1 minute remine to refresh

            clearPage(msg.template);
            populate(msg.state);
         }
         response = null;
         break;
      case "logout": //  Indicates previously attempted to logout
         document.location.href = "https://blackboard.princeton.edu/webapps/login?action=logout";
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
   var semDiffs = diffString.split('`');
   for (var i = 0; i < semDiffs.length; i++) {
      var split1 = semDiffs[i].split("'");
      var sem = split1[0];
      if (Diffs[sem] == undefined)
         Diffs[sem] = new Object();

      var courseDiffs = split1[1].split(';');
      for (var j = 0; j < courseDiffs.length; j++) {
         var split2 = courseDiffs[j].split(':');
         var courseKey = split2[0];
         if (Diffs[sem][courseKey] == undefined)
            Diffs[sem][courseKey] = new Object();

         var attrDiffs = split2[1].split(',');
         for (var k = 0; k < attrDiffs.length; k++) {
            var attr = attrDiffs[k];
            console.log("Diff in " + sem + ": " + courseKey + ": " + attr);

            Diffs[sem][courseKey][attr] = true;
         }
      }
   }
   showDiff();
}

//  Stores the compiled history of courses to the background
function pushCourses(NewCourses) {
   if (NewCourses != undefined)
      port.postMessage({note: "push", courses: NewCourses});
   else
      port.postMessage({note: "push", courses: Courses});
}

//  Updates a single course in background
function pushCourse(c) {
   port.postMessage({note: "pushSingle", course: c});
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
