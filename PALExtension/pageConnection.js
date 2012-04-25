//  Author: Wenley Tong
//  Written: 10 April 2012
//  pageConnection.js

//  Establishes the interface between the background page and content scripts
//  using requests.


//  Forms proper response to a pushCourses request
function pushRequest(req) {
    if (req.note == undefined || req.note != "push") {
       console.warn("Misrouted message. push when " + req.note);
       return {error: "Misrouted message."};
    }
    if (req.courses == undefined)
        return {error: "No courses pushed"};
    
    NewCourses = restorePrototype(req.courses);
    var checkDiff = setTimeout(runDiff, 1);
    return {note: "good"};
}

//  Forms proper response to a pushCourse request
function pushSingleRequest(msg) {
    if (msg.note == undefined || msg.note != "pushSingle") {
        console.warn("Misrouted message. pushSingle when " + msg.note);
        return {error: "Misrouted message."};
    }
    if (msg.course == undefined)
        return {error: "No course pushed"};

    if (NewCourses == null)
       NewCourses = {};
    if (NewCourses[msg.course.semester] == undefined)
       NewCourses[msg.course.semester] = {};
    NewCourses[msg.course.semester][msg.course.key] = restorePrototype(msg.course);
    var checkDiff = setTimeout(runDiff, 1000);

    //  Check to see if NewCourses has been fully populated as expected
    if (expected != 0) {
       var i = 0;
       for (var entry in NewCourses) {
          for (var subentry in NewCourses[entry])
             i++;
       }
       if (i > expected) {
          console.warn("i is too big...");
          console.warn("i: " + i + " vs. expected: " + expected);
       } //  Fall through...
       if (i >= expected) {
          console.log("! Notify the foreground that miner almost done");
          console.log(NewCourses);
          expected = 0;
       }
    }

    return {note: "good"};
}

//  Forms proper response to a pullCourses request
function pullRequest(req) {
    //  Error checking
    if (req.note == undefined || req.note != "pull") {
        console.warn("Misrouted message. pull when " + req.note);
        return {error: "Misrouted message"};
    }
    
    //  !!! Need to change back to OldCourses
    return {note: "courses", courses: NewCourses };
}

//  Updates OldCourses with NewCourses according to the contents
//  of the msg
function clickHandler(msg) {
   console.log("clickHandler not implemented");
   console.log("Message contents: ");
   for (var entry in msg) {
      console.log(entry + ": " + msg[entry]);
   }
   return null;
}

function sendToForeground(msg) {
   for (var id in ports) {
      ports[id].postMessage(msg);
   }
}

function templateHandler(msg) {
   if (msg.note == undefined || msg.note != "template") {
      console.warn("Misrouted message. template when " + msg.note);
      return {error: "Misrouted message"};
   }

   return {note: "template", template: document.body.innerHTML};
}

var expected = 0; //  Number of courses expected to be mined
//  Will route requests from content scripts to proper functions
function handleMessage(msg) {
    var response;
    switch (msg.note) {
        case "push":
            response = pushRequest(msg);
            break;
        case "pushSingle":
            response = pushSingleRequest(msg);
            break;
        case "pull":
            response = pullRequest(msg);
            break;
        case "click":
            response = clickHandler(msg);
            break;
        case "expected":
            expected = msg.expected;
            console.log("expected: " + expected);
            reseponse = null;
            break;
        case "template":
            response = templateHandler(msg);
            break;
        default:
            console.warn("Unknown note from foreground: " + msg.note);
            response = null;
            break;
    }
    return response;
}

//  Ports to currently open tabs
var ports = {};

//  Handles requests from the content scripts
chrome.extension.onConnect.addListener(function(newPort) {
      ports[newPort.portId_] = newPort;
      
      //  Temporary handle
      var port = newPort;
      port.onMessage.addListener(function(msg) {
            var response = handleMessage(msg);
            if (response != null)
               port.postMessage(response);
         });
      port.onDisconnect.addListener(function() {
            delete ports[port.portId_];
         });
   });

