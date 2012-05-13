// Author: Masha Okounkova
// Written 23 April 2012
// populateCourse.js

// Wrapper function 
function populateFromTabWrapper() {
   populateFromTab(this);
}

// Creates a tab and adds it to the table
function createTab(semester, name, currentTable, attribute, tagText) {
   // Create the main element
   var mainEl = document.createElement("th");
   mainEl.setAttribute("class", "tabTable");
   mainEl.setAttribute("name", name);
   mainEl.setAttribute("semester", semester);
   mainEl.setAttribute("attribute", attribute);

   mainEl.addEventListener("click", populateFromTabWrapper, false);

   var buttonHouse = document.createElement("div");
   buttonHouse.setAttribute("id", "buttonHouse");
   var buttonDiv = document.createElement("button");
   buttonDiv.setAttribute("id", "xButton");
   buttonDiv.innerText = "X";
   buttonDiv.addEventListener("click", function() { removeTab(this); }, false);

   var notButtonHouse = document.createElement("div");
   notButtonHouse.setAttribute("id", "notButtonHouse");
 notButtonHouse.innerText = tagText;  
  
   buttonHouse.appendChild(buttonDiv);
   mainEl.appendChild(buttonHouse);
 mainEl.appendChild(notButtonHouse);

   currentTable.appendChild(mainEl);
}

//  Fills in the tabs when a course is selected
function populateCourse(courseEl, state) {
   var semester = courseEl.getAttribute("semester");
   var name = courseEl.innerText;

   // This is a course
   if (Courses[semester] == null || Courses[semester] == undefined)
      throw "Improper usage: invalid semester name";
   if (Courses[semester][name] == null || Courses[semester][name] == undefined)
      throw "Improper usage: invalid course name";

   var currentCourse = Courses[semester][name];
   cleanObj(currentCourse);

   populateTitle(semester, name);

   // Sets the intial values for tabOrder for the course, if they have
   // not yet been set.

   if (currentCourse.tabOrder == undefined || currentCourse.tabOrder == null)
   {
      currentCourse.tabOrder = new Array();
      currentCourse.removedTabs = new Array();
   }
   if (currentCourse.tabOrder[0] == undefined || currentCourse.tabOrder[0] == null)
   {
      var k = 0;
      if (currentCourse.announcements != null)
      {
         currentCourse.tabOrder[k] = "announcements";
         k++;
      }
      if (currentCourse.courseMaterials != null)
      {
         currentCourse.tabOrder[k] = "courseMaterials";
         k++;
      }
      if (currentCourse.assignments != null)
      {
         currentCourse.tabOrder[k] = "assignments";
         k++;
      }
      if (currentCourse.syllabusDoc != null)
      {
         currentCourse.tabOrder[k] = "syllabusDoc";
         k++;
      }
      if (currentCourse.contacts != null)
      {
         currentCourse.tabOrder[k] = "contacts";
         k++;
      }
      if (currentCourse.tools != null)
      {
         currentCourse.tabOrder[k] = "tools";
         k++;
      }
      var i = 0;
      if (currentCourse.otherLinks != null) {
         for (; currentCourse.otherLinks[i] != undefined && i < currentCourse.otherLinks.length ; i++) {
            currentCourse.tabOrder[k+i] = currentCourse.otherLinks[i].name;
         }
      }
   }

   var currentTable = document.getElementById("courseTabTable");
   currentTable = currentTable.getElementsByTagName("tbody")[0];
   currentTable = currentTable.getElementsByTagName("tr")[0];
   while (currentTable.children.length > 0)
      currentTable.removeChild(currentTable.children[0]);

   for (var i = 0; i < 1000; i++)
   {
      if (currentCourse.tabOrder[i] == undefined || currentCourse.tabOrder[i] == null)
         break;
      switch(currentCourse.tabOrder[i])
      {
         case "announcements":
            // Make the Announcements tab
            if (currentCourse.announcements != null)
            {
               if (!isRemoved(semester, name, "announcements"))
               {
                  createTab(semester, name, currentTable, "announcements", "Announcements");
               }
            }
            break;

         case "syllabusDoc":
            // Make the Syllabus tab
            if (currentCourse.syllabusDoc != null)
            {
               if (!isRemoved(semester, name, "syllabusDoc"))
               {
                  createTab(semester, name, currentTable, "syllabusDoc", "Syllabus");
               }
            }
            break;

         case "courseMaterials":
            // Make the Course Materials link
            if (currentCourse.courseMaterials != null)
            {
               if (!isRemoved(semester, name, "courseMaterials"))
               {
                  createTab(semester, name, currentTable, "courseMaterials", "Course Materials");
               }
            }
            break;

         case "assignments":
            // Make the Assignments link
            if (currentCourse.assignments != null)
            {
               if (!isRemoved(semester, name, "assignments"))
               {
                  createTab(semester, name, currentTable, "assignments", "Assignments");
               }
            }
            break;

         case "contacts":
            // Make the Contacts link
            if (currentCourse.contacts != null)
            {
               if (!isRemoved(semester, name, "contacts"))
               {
                  createTab(semester, name, currentTable, "contacts", "Contacts");
               }
            }
            break;

         case "tools":
            // Make the Tools link
            if (currentCourse.tools != null)
            {
               if (!isRemoved(semester, name, "tools"))
               {
                  createTab(semester, name, currentTable, "tools", "Tools");
               }
            }
            break;

         default:
            //  Try to find an otherLink to match
            var tabName = currentCourse.tabOrder[i];
            var otherLink = null;
            for (var j = 0; j < currentCourse.otherLinks.length; j++) {
               if (currentCourse.otherLinks[j].name == tabName) {
                  otherLink = currentCourse.otherLinks[j];
                  break;
               }
            }
            if (otherLink != null) {
               if (!isRemoved(semester, name, otherLink.name)) {
                  createTab(semester, name, currentTable, otherLink.name, otherLink.name);
               }
            }
            break;
      }
   }

   if (state == undefined || state.tab == undefined)
      populateFromTab(currentTable.children[0]);
   else {
      for (var i = 0; i < currentTable.children.length; i++) {
         var thTab = currentTable.children[i];
         if (thTab.getAttribute("attribute") == state.tab) {
            populateFromTab(thTab);
            break;
         }
      }
   }
   removedPopup(semester, name);

   //  Update state variables
//   selectedSemester = Courses[semester];
//   selectedCourse = currentCourse;
   setSelectedSemester(Courses[semester], semester);
   setSelectedCourse(currentCourse);

   showDiff();
}

// Populates the "+" with the removed tabs
function removedPopup(semester, name) {

   if (Courses[semester] == null || Courses[semester] == undefined)
      throw "Improper usage: invalid semester name";
   if (Courses[semester][name] == null || Courses[semester][name] == undefined)
      throw "Improper usage: invalid course name";

   var currentCourse = Courses[semester][name];
   cleanObj(currentCourse);

   var currentTable = document.getElementById("courseTabTable");
   currentTable = currentTable.getElementsByTagName("tbody")[0];
   currentTable = currentTable.getElementsByTagName("tr")[0];

   if (document.getElementById("removeTabTable") != null)
   {
      var oldmainEl = document.getElementById("removeTabTable");
      oldmainElparent = oldmainEl.parentNode;
      oldmainElparent.removeChild(oldmainEl);
   }

   var mainEl = document.createElement("th");
   mainEl.setAttribute("id", "removeTabTable");
   mainEl.setAttribute("semester", semester);
   mainEl.setAttribute("name", name);
   var menuDiv = document.createElement("div");
   menuDiv.setAttribute("id", "menuDiv");
   var menuUl = document.createElement("ul");
   menuUl.setAttribute("id", "removeMenu");

   var mainLi = document.createElement("li");
   mainLi.innerText = "+";

   var subMenu = document.createElement("ul");

   if (currentCourse.removedTabs == null)
   {
      var subLi = document.createElement("li");
      subLi.innerText = "There are no removed tabs.";
      subMenu.appendChild(subLi);
   }
   else
   {
      for (var i = 0; i < 1000; i++)
      {
         if (currentCourse.removedTabs[i] == null || currentCourse.removedTabs[i] == undefined)
            break;
         var attribute = currentCourse.removedTabs[i];
         if (attribute == null || attribute == undefined)
         {
            break;
         }
         var subLi = document.createElement("li");
         subLi.addEventListener("click", function() { addTab(this); }, false);
         subLi.setAttribute("attribute", attribute);
         switch(attribute)
         {
            case "announcements":
               subLi.innerText = "Announcements";
               break;
            case "courseMaterials":
               subLi.innerText = "Course Materials";
               break;
            case "assignments":
               subLi.innerText = "Assignments";
               break;
            case "syllabusDoc":
               subLi.innerText = "Syllabus";
               break;
            case "contacts":
               subLi.innerText = "Contacts";
               break;
            case "tools":
               subLi.innerText = "Tools";
               break;
            default:
               subLi.innerText = attribute;
         }
         subMenu.appendChild(subLi);
      }
   }
   mainLi.appendChild(subMenu);
   menuUl.appendChild(mainLi);
   menuDiv.appendChild(menuUl);
   mainEl.appendChild(menuDiv);
   currentTable.appendChild(mainEl);
}
