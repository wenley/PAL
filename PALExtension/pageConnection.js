//  Author: Wenley Tong
//  Written: 10 April 2012
//  pageConnection.js

//  Establishes the interface between the background page and content scripts
//  using requests

var OldCourses = null;
var NewCourses = null;

function testConnection() {
   chrome.tabs.getCurrent(function (tab) { console.log(tab.id); });
}


//  Forms proper response to a pullCourses request
function pullRequest(req) {
    //  Error checking
    if (req[note] == undefined || req[note] != "pull") {
        console.log("Misrouted message");
        return {error: "Misrouted message"};
    }
    
    return {courses: OldCourses };
}


//  Forms proper response to a pushCourses request
function pushRequest(req) {
    if (req[courses] == undefined)
        return {error: "No courses pushed"};
    if (req[note] == undefined || req[note] != "push") {
       console.log("Misrouted message. push when " + req[note]);
       return {error: "Misrouted message."};
    }
    
    NewCourses = req.courses;
    var checkDiff = setTimeout("runDiff();", 1);
    return {status: "All good"};
}

//  Compares two objects, one and two. Notes differences between then on console
function diffObj(one, two) {

    //  Check both real check-able objects
    if (one == undefined || one == null) {
        console.log(two);
        console.log(" has no match");
        console.log("=============");
        return;
    }
    if (two == undefined || two == null) {
        console.log(one);
        console.log(" has no match");
        console.log("=============");
        return;
    }
    
    //  Compare classes
    var c1 = getClass(one);
    var c2 = getClass(two);
    if (c1 != c2) {
        console.log("Unmatched classes: " + c1 + ", " + c2);
        console.log("=============");
        return;
    }

    //  Check strings and stop
    if (c1 == "[object String]" && c1 != c2) {
        console.log("Diff: " + c1 + " vs. " + c2);
        return;
    }
    
    for (var entry in one) {
        var el1 = one[entry];
        var el2 = two[entry];
    }
}

//  Checks for differences between OldCourses and NewCourses
function runDiff() {
   for (var i = 0; NewCourses[i] != undefined; i++) {
      var newC = NewCourses[i];
      var oldC = OldCourses[i];
      if (oldC == undefined)
         console.log("New Course!");

      diffObj(oldC, newC);
   }
}


//  Will route requests from content scripts to proper functions
function handleMessage(msg) {
   console.log("Successful re-route of request!");
   console.log("Request contents:");
   for (var entry in msg) {
      console.log(entry + ": ");
      console.log(msg[entry]);
   }
   return {response: "No message from the background"};
}


//  Handles requests from the content scripts
chrome.extension.onConnect.addListener(function(port) {
      console.log(port);
      port.onMessage.addListener(function(msg) {
            console.log("Content is asking for something...");
            var response = handleMessage(msg);
            console.log("Getting out of background handler");
            port.postMessage(response);
         });
   });

