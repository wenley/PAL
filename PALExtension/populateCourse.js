// Author: Masha Okounkova
// Written 23 April 2012
// populateCourse.js

function createTab(semester, name, currentTable, attribute, tagText) {

   // Create the main element
   var mainEl = document.createElement("th");
   mainEl.setAttribute("class", "tabTable");
   mainEl.setAttribute("name", name);
   mainEl.setAttribute("semester", semester);
   mainEl.setAttribute("attribute", attribute);

   // Create the remove button
   var buttonDiv = document.createElement("div");
   buttonDiv.setAttribute("id", "xButton");
   var buttonLink = document.createElement("a");
   buttonLink.setAttribute("class", "button");
   buttonLink.innerText = "X";
   buttonLink.addEventListener("click", function() { removeTab(this); }, false);
   buttonDiv.appendChild(buttonLink);
   mainEl.appendChild(buttonDiv);

   // Set the link
   var mainLink = document.createElement("a");
   mainLink.addEventListener("click", function() { populateFromTab(this); }, false);
   mainLink.innerText = tagText;
   mainEl.appendChild(mainLink);

   currentTable.appendChild(mainEl);
}

//  Fills in the tabs when a course is selected
function populateCourse(courseEl) {
   var semester = courseEl.getAttribute("semester");
   var name = courseEl.innerText;

   // This is a course
   if (Courses[semester] == null || Courses[semester] == undefined)
      throw "Improper usage: invalid semester name";
   if (Courses[semester][name] == null || Courses[semester][name] == undefined)
      throw "Improper usage: invalid course name";

   var currentCourse = Courses[semester][name];
   cleanObj(currentCourse);

   // Sets the intial values for tabOrder for the course, if they have
   // not yet been set.

   if (currentCourse.tabOrder == undefined)
      currentCourse.tabOrder = new Object();
   if (currentCourse.tabOrder[0] == undefined)
   {
      currentCourse.tabOrder[0] = "announcements";
      currentCourse.tabOrder["announcements"] = 0;
      currentCourse.tabOrder[1] = "courseMaterials";
      currentCourse.tabOrder["courseMaterials"] = 1;
      currentCourse.tabOrder[2] = "assignments";
      currentCourse.tabOrder["assignments"] = 2;
      currentCourse.tabOrder[3] = "syllabusDoc";
      currentCourse.tabOrder["syllabusDoc"] = 3;
      currentCourse.tabOrder[4] = "descriptionLink";
      currentCourse.tabOrder["descriptionLink"] = 4;
      currentCourse.tabOrder[5] = "contacts";
      currentCourse.tabOrder["contacts"] = 5;
      currentCourse.tabOrder[6] = "tools";
      currentCourse.tabOrder["tools"] = 6;

      currentCourse.tabOrder["length"] = 7;
   }

   var currentTable = document.getElementById("courseTabTable");
   currentTable = currentTable.getElementsByTagName("tbody")[0];
   currentTable = currentTable.getElementsByTagName("tr")[0];
   while (currentTable.children.length > 0)
      currentTable.removeChild(currentTable.children[0]);

   var length = currentCourse.tabOrder["length"];

   for (var i = 0; i < length; i++)
   {
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

         case "descriptionLink":
            // Make the Description link
            if (currentCourse.descriptionLink != null)
            {
               if (!isRemoved(semester, name, "descriptionLink"))
               {
                  createTab(semester, name, currentTable, "descriptionLink", "Course Description");
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
      }
   }

   populateFromTab(currentTable.children[0].children[1]);
   console.log("About to call removed popup with " + semester + name);
   removedPopup(semester, name);
   console.log("The removedPopupo function got called");

   //  Update state variables
   selectedSemester = Courses[semester];
   selectedCourse = currentCourse;
}

function removedPopup(semester, name) {

   console.log("In removed popup.....");

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
//      oldmainElgrandparent = oldmainElparent.parentNode;
//      oldmainElgrandparent.removeChild(oldmainElparent);
   }

   // Create the "+" tab to add more courses
   var mainEl = document.createElement("th");
   mainEl.setAttribute("id", "removeTabTable");
   mainEl.setAttribute("semester", semester);
   mainEl.setAttribute("name", name);
   var menuUl = document.createElement("ul");
   menuUl.setAttribute("id", "removeMenu");

   var mainLi = document.createElement("li");
   mainLi.innerText = "+++++++++++";

   var subMenu = document.createElement("ul");

   if (currentCourse.removedTabs == null)
   {
      console.log("no removed tabs...");
      var subLi = document.createElement("li");
      subLi.innerText = "There are no removed tabs!";
      subMenu.appendChild(subLi);
   }
   else
   {
      total = currentCourse.removedTabs.length;
      console.log("THE TOTAL IS:::::: " + total);
      for (var i = 0; i < total; i++)
      {
         var attribute = currentCourse.removedTabs[i];
         if (attribute == null || attribute == undefined)
            break;
         var subLi = document.createElement("li");
         var link = document.createElement("a");
         link.addEventListener("click", function() { addTab(this); }, false);
         link.setAttribute("attribute", attribute);
         switch(attribute)
         {
            case "announcements":
               link.innerText = "Announcements";
               break;
            case "courseMaterials":
               link.innerText = "Course Materials";
               break;
            case "assignments":
               link.innerText = "Assignments";
               break;
            case "syllabusDoc":
               link.innerText = "Syllabus";
               break;
            case "descriptionLink":
               link.innerText = "Course Description";
               break;
            case "contacts":
               link.innerText = "Contacts";
               break;
            case "tools":
               link.innerText = "Tools";
               break;
         }
         subLi.appendChild(link);
         subMenu.appendChild(subLi);
      }
   }
   console.log("Got down to here");
   mainLi.appendChild(subMenu);
   menuUl.appendChild(mainLi);
   mainEl.appendChild(menuUl);
   currentTable.appendChild(mainEl);
}


