//  Author: Wenley Tong
//  Written: 10 April 2012

//  Clears the current page and replaces with s
function clearPage(s) {
    if (s == undefined)
        document.documentElement.innerHTML = docHeadString;
    var c = getClass(s);
    if (c == "[object String]")
        document.documentElement.innerHTML = docHeadString + s;
    else if (c == "[object HTMLBodyElement]")
        document.body = s;
    else
        console.log(c);
}

//  Gets template
function copyFromBackground() {
    console.log("Attempt copy over...");
    var q = chrome.extension.getURL("template.html");
    console.log(q);
}


function write(obj) {
    if (obj == undefined)
        return;
    var c = getClass(obj);
    if (isString(obj)) {
        document.body.innerHTML += obj + "<br/>";
    }
    else if (isArray(obj)) {
        for (var i = 0; obj[i] != undefined; i++) {
            write(obj[i]);
        }
    }
    else if (c == "[object Course]") {
        for (var entry in obj) {
            write(obj[entry]);
        }
    }
    else {
        console.log("Unknown class: " + c);
    }
}
   

//  Writes raw text of courses to document
function writeCourses() {
    console.log("Attempting to write content to page...");
    for (var i = 0; i < Courses.length; i++) {
        write(Courses[i]);
    }
}

//  Start chain of either render or mine
pullCourses();
var qwer = setTimeout(copyFromBackground, 1);
