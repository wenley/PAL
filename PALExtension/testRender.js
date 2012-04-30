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
       console.warn("Unrecognized class to clear with: " + c);
}

//  Gets template
function copyFromBackground() {
   copyTemplate();
}

//  Displays content in notTabBar div of template according to
//  the specifications in msg
function display(msg) {
   if (msg.semester == undefined || msg.semester == null)
      console.warn("Semester not defined.");
   var sem = Courses[msg.semester];
   if (sem == undefined)
      console.warn("Invalid semester: " + msg.semester);
   
   if (msg.courseKey == undefined || msg.courseKey == null)
      console.warn("CourseKey not defined.");
   var course = sem[msg.courseKey];
   if (course == undefined)
      console.warn("Invalid courseKey: " + msg.courseKey);
   //  sem[msg.courseKey] = cleanObj(course);
   //  course = sem[msg.courseKey];

   if (msg.section == undefined || msg.section == null)
      console.warn("Section not defined.");
   var obj = course[msg.section];
   if (obj == undefined)
      console.warn("Invalid section: " + msg.section);
   if (obj == null)
      return; //  Empty field of the course

   if (isArray(obj)) {
      for (var entry in obj) {
         var newEl = obj[entry].toHTML();
         var center = document.body.getElementById("notTabBar");
         center.appendChild(newEl);
      }
   }
   else if (isObject(obj)) {
      var center = document.body.getElementById("notTabBar");
      center.appendChild(obj.toHTML());
   }
      
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
        console.warn("Unknown class: " + c);
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

