//  Author: Wenley Tong
//  Written: 23 April 2011
//  popTabs.js

//  Performs population of the page when a tab is clicked

function populateFromTab(tabLinkEl) {
   var tabEl = tabLinkEl.parentElement;
   var semester = tabEl.getAttribute("semester");
   var courseKey = tabEl.getAttribute("name");
   var attribute = tabEl.getAttribute("attribute");
   
    //  Validate inputs; should never be invalid
    var sem = Courses[semester];
    if (sem == undefined || sem == null) {
        throw "Not a valid semester: " + semester;
        return;
    }
    var course = sem[courseKey];
    if (course == undefined || course == null) {
        throw "In semester " + semester + ", not a valid course: " + courseKey;
        return;
    }
    var attr = course[attribute];
    if (attr == undefined || attr == null) {
        throw "In (semester, course) = (" + semester + ", " + course + "), not a valid attribute: " + attribute;
        return;
    }
    
    var space = document.getElementById("notTabBar");
    space.innerHTML = "";

    if (attribute == "announcements") {
       for (var entry in attr) 
          space.appendChild(ToHTML(attr[entry]));
    }
    else if (attribute == "courseMaterials") {
       for (var entry in attr)
          space.appendChild(ToHTML(attr[entry]));
    }
    else if (attribute == "syllabusDoc") {
       console.log("Syllabus not working right now...");
    }
    else if (attribute == "assignments") {
       for (var entry in attr)
          space.appendChild(ToHTML(attr[entry]));
    }
    else if (attribute == "contacts") {
       for (var entry in attr)
          space.appendChild(ToHTML(attr[entry]));
    }
    else if (attribute == "tools") {
       for (var entry in attr)
          space.appendChild(ToHTML(attr[entry]));
    }
    else if (attribute == "otherLinks") {
       console.log("otherLinks not currently handled...");
    }
    else {
       console.warn("Unrecognized attribute: " + attribute);
    }
}