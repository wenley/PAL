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
    var checkDiff = setTimeout(runDiff, 1000);
    console.log(NewCourses);
    saveToLocal();
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
//    saveToLocal();
    return {note: "good"};
}

//  Updates OldCourses with NewCourses according to the contents
//  of the msg
function clickHandler(msg) {
   console.log("clickHandler not implemented"); //  !!!
   console.log("Message contents: "); //  !!!
   for (var entry in msg) {
      console.log(entry + ": " + msg[entry]); //  !!!
   }
   return null;
}

function sendToForeground(msg) {
   for (var id in ports) {
      ports[id].postMessage(msg);
   }
}

//  Clears local storage when requested
function clearHandler(msg) {
   if (msg.note == undefined || msg.note != "clear") {
      console.warn("Misrouted message. clear when " + msg.note);
      return { error: "Misrouted message"};
   }

   clearLocal();
   return { note: "cleared" };
}

//  Gets the user's settings and courses
//  Replaces pullRequest
function setUserHandler(msg) {
   if (msg.note == undefined || msg.note != "user") {
      console.warn("Misrouted message. user when " + msg.note);
      return { error: "Misrouted message"};
   }
   
   //  Previously attempted to logout
   if (logout == true) {
      logout = false;
      return { note: "logout" };
   }

   loadUser(msg.user);
   return { note: "loaded", courses: OldCourses,
          state: state,
          template: document.body.innerHTML };
}

function saveStateHandler(msg, portId) {
   if (msg.note == undefined || msg.note != "state") {
      console.warn("Misrouted message. state when " + msg.note);
      return { error: "Misrouted message"};
   }

   state = msg.state;
   saveToLocal();
}

//  Allows for single button logout
var logout = false;
function logoutHandler(msg) {
   if (logout == false)
      logout = true;
}

//  var expected = 0; //  Number of courses expected to be mined
//  Will route requests from content scripts to proper functions
function handleMessage(msg, portId) {
    var response;
    switch (msg.note) {
        case "push":
            response = pushRequest(msg);
            break;
        case "pushSingle":
            response = pushSingleRequest(msg);
            break;
        case "click":
            response = clickHandler(msg);
            break;
        case "clear":
            response = clearHandler(msg);
            break;
        case "user":
            response = setUserHandler(msg);
            break;
        case "state":
            response = saveStateHandler(msg, portId);
            break;
        case "logout":
            response = logoutHandler(msg);
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
            var response = handleMessage(msg, port.portId_);
            if (response != null)
               port.postMessage(response);
         });
      port.onDisconnect.addListener(function() {
            delete ports[port.portId_];
         });
   });

