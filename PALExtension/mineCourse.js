//  Author: Wenley Tong
//  Written: 8 April 2012

//  Mines a particular sidebar element
function mineSidebar(a, course) {
    for (i = 0; i < a.length; i++) {
        switch(a[i][0]) {
            case "Announcements":
                console.log("Will mine announcements later");
                break;
           case "Syllabus":
               console.log("Will mine Syllabus later");
               break;
           case "Course Description":
               console.log("Mining Course Description");
               mineCourseDescription(a[i][1], course);
               break;
           case "Course Materials":
               console.log("Will mine Course Materials later");
               break;
           case "Assignments":
               console.log("Will mine Assignments later");
               mineMasha(a[i][1], course);
               break;
           case "Contacts":
               mineContacts(a[i][1], course);
               break;
           case "Tools":
               console.log("Starting Tools mining...");
               mineTools(a[i][1], course);
               break;
           default:
               console.log("Unhandled: Will mine " + a[i][0] + " later");
               break;
        }
    }
    console.log("Finished sending requests for side bar for " + course.title.substr(0,6));
}
//  - - - - - COURSE CONTENT DOC FUNCTIONS - - - - -

//  Given a course's web page link, mine it
function mineCourseFromLink(contentPageLink, course) {
    var req = new XMLHttpRequest();
    req.open("GET", contentPageLink, true);
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            mineCourse(req.responseText, course);
        }
    }
    req.send();
}

//  Given a course content document, mines the course page and
//  puts content into course
function mineCourse(contentText, course) {
    console.log('In class');
    
    //  Find sidebar list elements
    var listElems = contentText.match(/<li[^>]*paletteItem[^>]*>\s*<a[^>]*>\s*<span[^>]*>.*<\/span>\s*<\/a>\s*<\/li>/g);
    var a = new Array();
    for (i = 0; i < listElems.length; i++) {
        s = cleanLink(listElems[i]);
        var miniDoc = parser.parseFromString(s, "text/xml");
        var link = miniDoc.getElementsByTagName("a")[0].getAttribute("href");
        var name = miniDoc.getElementsByTagName("span")[0].textContent;
        a[i] = new Array();
        a[i][0] = name;
        a[i][1] = link;
    }
    
    mineSidebar(a, course);
}