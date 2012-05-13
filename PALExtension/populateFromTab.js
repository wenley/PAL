//  Author: Wenley Tong
//  Written: 23 April 2011
//  popTabs.js

//  Performs population of the page when a tab is clicked

function populateFromTab(tabLinkEl) {
   var tabEl = tabLinkEl;
   var semester = tabEl.getAttribute("semester");
   var courseKey = tabEl.getAttribute("name");
   var attribute = tabEl.getAttribute("attribute");

   //  Update state variables
   setSelectedTab(tabLinkEl);
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
      //  Try finding it in otherLinks
      for (var i = 0; i < course.otherLinks.length; i++) {
         if (course.otherLinks[i].name == attribute) {
            attr = course.otherLinks[i];
            attribute = "otherLinks";
            break;
         }
      }
      if (attr == undefined || attr == null) {
         throw "In (semester, course) = (" + semester + ", " + course + "), not a valid attribute: " + attribute;
         return;
      }
   }

   var space = document.getElementById("notTabBar");
   space.innerHTML = "";

   if (attribute == "announcements") {
      for (var entry in attr)
         space.appendChild(toHTML(attr[entry]));
   }
   else if (attribute == "courseMaterials") {
      for (var i = attr.length - 1; i >= 0; i--)
         space.appendChild(toHTML(attr[i]));
   }
   else if (attribute == "syllabusDoc") {
      if (isPDF(course.syllabusDoc.link))
         populateIframe(course.syllabusDoc.link);
      else {
         console.log("Not a PDF");
         space.appendChild(toHTML(course.syllabusDoc));
      }
   }
   else if (attribute == "assignments") {
      for (var i = attr.length - 1; i >= 0; i--)
         space.appendChild(toHTML(attr[i]));
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
      if (isArray(attr)) {
         //  Start from 1 since 0 is the name
         for (var i = 1; i < attr.length; i++)
            space.appendChild(toHTML(attr[i]));
      }
      else
         populateIframe(attr.link);
   }
   else {
      console.warn("Unrecognized attribute: " + attribute);
   }
}

//  Replaces the body of the template with the content text
//  of the link
function populateBodyFromLink(url) {
   var body = document.getElementById("notTabBar");

   var link = url;
   if (link.substr(0, bbDomain.length) != bbDomain)
      link = bbDomain + link;

   var iframe = document.createElement("iframe");
   iframe.setAttribute("src", link);
   iframe.setAttribute("class", "tool");
   body.innerHTML = "";
   addBackLink();
   body.appendChild(iframe);
}

//  Replaces the body of the template with the contents of
//  the folder. Updates folderTrace.
function populateFromFolder(newFolderName) {
   var course = selectedCourse;
   var thEl = selectedTab;
   var attrName = thEl.getAttribute("attribute");
   var attr = course[attrName];

   //  Search through otherLinks
   if (attr == undefined) {
      var others = course.otherLinks;
      for (var i = 0; i < others.length; i++) {
         if (others[i].name == attrName) {
            attr = others[i];
            break;
         }
      }
   }
   if (attr == undefined)
      console.warn(course.key + ": " + attrName + " not found");

   var body = document.getElementById("notTabBar");

   //  Find past object
   var pastFolder;
   var docs;
   if (folderTrace.length > 0) {
      pastFolder = folderTrace[folderTrace.length - 1];
      docs = pastFolder.contents;
   }
   else {
      pastFolder = { name: attrName };
      docs = attr;
   }
   console.log(thEl);
   console.log(attrName);
   console.log(attr);
   console.log(pastFolder);
   console.log(docs);

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

   //  Show current location
   body.innerHTML = "";
   var curFolDiv = document.createElement("div");
   var location = document.createElement("h3");
   location.innerText = newFolder.name;
   curFolDiv.setAttribute("align", "center");
   curFolDiv.appendChild(location);
   body.appendChild(curFolDiv);

/*   //  Create proper link to return to previous folder
   var backDiv = document.createElement("div");
   var backLink = document.createElement("a");
   backLink.innerText = "Back to " + pastFolder.name;
   backLink.addEventListener("click", function () {
         folderTrace.pop();
         var parent = folderTrace.pop();
         if (parent == undefined) {
            //  Reached tab itself
            var tabs = document.getElementsByTagName("th");
/*            var trueTab = null;
            for (var i = 0; i < tabs.length; i++) {
               if (tabs[i].getAttribute("attribute") == attrName)
                  trueTab = tabs[i].children[1];
            }
            if (trueTab == null)
               console.warn("Tab " + selectedTab + " not found in tabs...");

            populateFromTab(selectedTab);
         }
         else {
            populateFromFolder(parent.name);
         }
      }, false);
   backDiv.appendChild(backLink);
   body.appendChild(backDiv); */

   addBackLink();

   //  Put in newFolder's contents;
   for (var i = 0; i < newFolder.contents.length; i++) {
      body.appendChild(toHTML(newFolder.contents[i]));
   }
}


//  Detects whether a particular link is a PDF
function isPDF(link) {
   //  Make proper
   var stripped = strip(link);
   if (link.substr(0, 4) != "http")
      stripped = bbDomain + link;

   if (stripped.match(/\.pdf$/) != null)
      return true;
   else {
      var req = new XMLHttpRequest();
      req.open("GET", stripped, false);
      try {
         req.send();
         return req.responseText.substr(0, 4) == "%PDF";
      } catch (e) {
         return false;
      }
   }
}