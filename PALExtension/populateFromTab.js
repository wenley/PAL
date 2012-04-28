//  Author: Wenley Tong
//  Written: 23 April 2011
//  popTabs.js

//  Performs population of the page when a tab is clicked

function populateFromTab(tabLinkEl) {
   var tabEl = tabLinkEl.parentElement;
   var semester = tabEl.getAttribute("semester");
   var courseKey = tabEl.getAttribute("name");
   var attribute = tabEl.getAttribute("attribute");
   
   //  Update state variables
   selectedTab = attribute;
   folderTrace = new Array();
   
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
       var iframe = document.createElement("iframe");
       iframe.setAttribute("class", "tool");
       iframe.setAttribute("src", bbDomain + attr.link);
       space.appendChild(iframe);
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
         try {
            var cleanText = HTMLtoXML(text);
         } catch (e) {
            var iframe = document.createElement("iframe");
            iframe.setAttribute("src", link);
            iframe.setAttribute("class", "tool");
            body.innerHTML = "";
            body.appendChild(iframe);
            return;
         }
         var miniDoc = parser.parseFromString(cleanText, "text/xml");

         var contentDiv = miniDoc.getElementById("containerdiv");
         console.log(contentDiv);
         var children = contentDiv.childNodes;
         var content = null;
         for (var i = 0; i < children.length; i++) {
            if (children[i].getAttribute != undefined) {
               if (children[i].getAttribute("class") == "clearfix") {
                  content = children[i];
               }
            }
         }
         
         if (content == null) {
            console.warn("Content clearfix not found...");
            body.innerHTML = "";
            body.appendChild(contentDiv);
         }
         else {
            body.innerHTML = "";
            body.appendChild(content);
         }
      }
   }
   req.send();
}

//  Replaces the body of the template with the contents of
//  the folder. Updates folderTrace.
function populateFromFolder(newFolderName) {
   console.log(arguments.callee.caller);
   var course = selectedCourse;
   var attr = course[selectedTab];
   var body = document.getElementById("notTabBar");

   //  Find past object
   var pastFolder;
   var docs;
   if (folderTrace.length > 0) {
      pastFolder = folderTrace[folderTrace.length - 1];
      docs = pastFolder.fileLinks;
   }
   else {
      pastFolder = { name: selectedTab };
      docs = attr;
   }

   //  Find newFolder's object
   var newFolder = null;
   for (var i = 0; i < docs.length; i++) {
      if (docs[i].name == newFolderName)
         newFolder = docs[i];
   }
   if (newFolder == null) {
      console.warn("Folder " + newFolderName + " not found in " + pastFolder.name);
      body.innerHTML = "<p>ERROR. See console for details</p>"; //  !!!
      return;
   }

   //  Update folder stack trace
   folderTrace.push(newFolder);

   //  Create proper link to return to previous folder
   var backDiv = document.createElement("div");
   var backLink = document.createElement("a");
   backLink.innerText = "Back to " + pastFolder.name;
   backLink.addEventListener("click", function () {
         folderTrace.pop();
         var parent = folderTrace.pop();
         if (parent == undefined) {
            //  Reached tab itself
            var tabs = document.getElementsByTagName("th");
            var trueTab = null;
            for (var i = 0; i < tabs.length; i++) {
               if (tabs[i].getAttribute("attribute") == selectedTab)
                  trueTab = tabs[i].children[1];
            }
            if (trueTab == null)
               console.warn("Tab " + selectedTab + " not found in tabs...");

            populateFromTab(trueTab);
         }
         else {
            populateFromFolder(parent.name);
         }
      }, false);
   backDiv.appendChild(backLink);
   body.appendChild(backDiv);

   //  Put in newFolder's contents;
   for (var i = 0; i < newFolder.fileLinks.length; i++) {
      body.appendChild(toHTML(newFolder.fileLinks[i]));
   }
}
