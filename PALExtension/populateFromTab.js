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
          space.appendChild(toHTML(attr[entry]));
    }
    else if (attribute == "courseMaterials") {
       for (var entry in attr)
          space.appendChild(toHTML(attr[entry]));
    }
    else if (attribute == "syllabusDoc") {
       console.log("Syllabus not working right now...");
    }
    else if (attribute == "assignments") {
       for (var entry in attr)
          space.appendChild(toHTML(attr[entry]));
    }
    else if (attribute == "contacts") {
       for (var entry in attr)
          space.appendChild(toHTML(attr[entry]));
    }
    else if (attribute == "tools") {
       for (var entry in attr)
          space.appendChild(toHTML(attr[entry]));
    }
    else if (attribute == "otherLinks") {
       console.log("otherLinks not currently handled...");
    }
    else {
       console.warn("Unrecognized attribute: " + attribute);
    }
}

//  Replaces the body of the template with the content text
//  of the link
function populateBodyFromLink(url) {
   var link = url;
   if (link.substr(0, bbDomain.length) != bbDomain)
      link = bbDomain + link;
   
   var req = new XMLHttpRequest();
   req.open("GET", link, true);
   req.onreadystatechange = function () {
      if (req.readyState == 4 && req.status == 200) {
         var body = document.getElementById("notTabBar");
         var text = cleanLink(req.responseText);
         text = text.replace(/<img[^>]*>/g, "");
         var locStart = text.indexOf("<div class=\"locationPane");
         var locEnd = text.indexOf("</div", locStart);
         var next = text.indexOf("</div", locStart);
         do {
            locEnd = next;
            next = text.indexOf("</div", locEnd + 1);
         } while (next != -1);
         text = text.slice(locStart, locEnd) + "</div>";
         miniDoc = HTMLtoDOM(text);
         console.log(miniDoc);
         
         //  Transfer formatted text
         body.innerHTML = "";
         console.log(miniDoc.documentElement.getElementsByTagName("body")[0]);
         var children = miniDoc.documentElement.getElementsByTagName("body")[0].childNodes;
         for (var i = 0; i < children.length; i++) {
            console.log(children[i]);
            body.appendChild(children[i]);
         }
      }
   }
   req.send();
}