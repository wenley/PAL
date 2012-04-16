//  Author: Wenley Tong
//  Written: 10 April 2012
//  pageConnection.js

//  Establishes the interface between the background page and content scripts
//  using requests.

//  Forms proper response to a pushCourses request
function pushRequest(req) {
    if (req.note == undefined || req.note != "push") {
       console.log("Misrouted message. push when " + req.note);
       return {error: "Misrouted message."};
    }
    if (req.courses == undefined)
        return {error: "No courses pushed"};
    
    NewCourses = req.courses;
    var checkDiff = setTimeout("runDiff();", 1);
    return {note: "good"};
}

//  Forms proper response to a pushCourse request
function pushSingleRequest(msg) {
    if (msg.note == undefined || msg.not != "pushSingle") {
        console.log("Misrouted message. pushSingle when " + msg.note);
        return {error: "Misrouted message."};
    }
    if (msg.course == undefined)
        return {error: "No course pushed"};

    NewCourses[msg.course.title] = msg.course;
    var checkDiff = setTimeout("runDiff();", 1);
    return {note: "good"};
}

//  Forms proper response to a pullCourses request
function pullRequest(req) {
    //  Error checking
    if (req.note == undefined || req.note != "pull") {
        console.log("Misrouted message");
        return {error: "Misrouted message"};
    }
    
    return {note: "courses", courses: OldCourses };
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

//  Forms message to foreground reporting a change
function reportChange() {
   console.log("reportChange not yet implemented");
}

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
        default:
            console.log("Unknown note from foreground: " + msg.note);
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
      console.log(ports);
      
      //  Temporary handle
      var port = newPort;
      console.log(port);
      console.log(newPort.portId_);
      port.onMessage.addListener(function(msg) {
            var response = handleMessage(msg);
            if (response != null)
               port.postMessage(response);
         });
      port.onDisconnect.addListener(function() {
            delete ports[port.portId_];
         });
   });

