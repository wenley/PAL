//  Author: Wenley Tong
//  Written: 8 April 2012

//  Mines a particular sidebar element
function mineSidebar(a, course) {
   for (i = 0; i < a.length; i++) {
      switch(a[i][0]) {
         case "Announcements":
            console.log(course.key + ": Mining Annoucenments");
            mineAnnouncements(a[i][1], course);
            break;
         case "Syllabus":
            console.log(course.key + ": Mining Syllabus");
            mineSyllabus(a[i][1], course);
            break;
         case "Course Description":
            mineCourseDescription(a[i][1], course);
            console.log(course.key + ": Mining Course Description");
            break;
         case "Course Materials":
            mineDocuments(a[i][1], course, "Course Materials");
            console.log(course.key + ": Mining Course Materials");
            break;
         case "Assignments":
            mineDocuments(a[i][1], course, "Assignments");
            console.log(course.key + ": Mining Assignments");
            break;
         case "Contacts":
            mineContacts(a[i][1], course);
            console.log(course.key + ": Mining Contacts");
            break;
         case "Tools":
            mineTools(a[i][1], course);
            console.log(course.key + ": Mining Tools");
            break;
         default:
            var t = new Tool();
            t.name = a[i][0];
            t.link = a[i][1];
            if (couldDocumentMine(t.link)) {
               console.log("Will mine using mineDocuments");
            }
            else if (couldToolMine(t.link)) {
               console.log("Will mine using mineTools");
            }

            if (course.otherLinks == null)
               course.otherLinks = new Array();
            course.otherLinks.push(t);
            break;
      }
   }
}

//  Determines if we could mine text using mineDocuments
function couldDocumentMine(text) {
   var req = new XMLHttpRequest();
   req.open("GET", link, true);
   req.onreadystatechange = function () {
      if (req.readyState == 4 && req.status == 200) {
         console.log("Came back!");
      }
      else if (req.readyState == 4) {
         console.log("Something went wrong...");
      }
   }
   req.send();
}

//  Determines if we could mine text using mineTools
function couldToolMine(text) {
   console.log("Not trying to be tricky yet.");
}


//  - - - - - COURSE CONTENT DOC FUNCTIONS - - - - -

//  Given a course's web page link, mine it
function mineCourseFromLink(contentPageLink, course) {
   var req = new XMLHttpRequest();
   XMLincrement();
   req.open("GET", contentPageLink, true);
   req.onreadystatechange = function () {
      if (req.readyState == 4 && req.status == 200) {
         mineCourse(req.responseText, course);
         XMLdecrement();
      }
      else if (req.readyState == 4 && req.status != 200)
      {
         console.warn(course.key + "Error, status is: " + req.status);
         XMLdecrement();
      }
   }
   req.send();
}

//  Given a course content document, mines the course page and
//  puts content into course
function mineCourse(contentText, course) {
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
