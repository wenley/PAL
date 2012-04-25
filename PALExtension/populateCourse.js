// Author: Masha Okounkova
// Written 23 April 2012
// populateCourse.js

function createTab(semester, name, currentTable, attribute, tagText) {

   // Create the main element
   var mainEl = document.createElement("th");
   mainEl.setAttribute("class", "tabTable");
   mainEl.setAttribute("name", attribute);
 
   // Create the remove button
   var buttonDiv = document.createElement("div");
   buttonDiv.setAttribute("id", "xButton");
   var buttonLink = document.createElement("a");
   buttonLink.setAttribute("class", "button");
   buttonLink.innerText = "X";
   buttonLink.setAttribute("href", "javascript:removeTab('" + semester + "','" +
                         name + "','" + attribute + "')");
   buttonDiv.appendChild(buttonLink);
   mainEl.appendChild(buttonDiv);
 
   // Set the linl
   var mainLink = document.createElement("a");
   mainLink.setAttribute("href", "javascript:populateFromTab('" + semester + "','" +
                     name + "','" + attribute + "')");
   mainLink.innerText = tagText;
   mainEl.appendChild(mainLink);

   currrentTable.appendChild(mainEl);
}

function populateCourse(semester, name) {

   // This is a course
   if (Courses[semester] == null || Courses[semester] == undefined)
      throw "Improper usage: invalid semester name";
   if (Courses[semester][name] == null || Courses[semester][name] == null)
      throw "Improper usage: invalid course name";

   var currentCourse = Courses[semester][name];
   cleanObj(currenCourse);

   var currentTable = document.getElementById("courseTabTable");
   currentTable = currentTable.getElementsByTagName("tbody")[0];
   currentTable = currentTable.getElementsByTagName("tr")[0];

   // Make the Announcements tab
   if (currentCourse.announcements != null)
   {
      if (!isRemoved(semester, name, "announcements"))
      {
         createTab(semester, name, currentTable, "announcements", "Announcements");
      }
   }

   // Make the Syllabus tab
   if (currentCourse.syllabusDoc != null)
   {
      if (!isRemoved(semester, name, "syllabusDoc"))
      {
         createTab(semester, name, currentTable, "syllabusDoc", "Syllabus");
      }
   }

   // Make the Description link
   if (currentCourse.descriptionLink != null)
   {
      if (!isRemoved(semester, name, "descriptionLink"))
      {
         createTab(semester, name, currentTable, "descriptionLink", "Course Description");
      }
   }

   // Make the Course Materials link
   if (currentCourse.courseMaterials != null)
   {
      if (!isRemoved(semester, name, "courseMaterials"))
      {
         createTab(semester, name, currentTable, "courseMaterials", "Course Materials");
      }
   }
 
   // Make the Assignments link
   if (currentCourse.assignments != null)
   {
      if (!isRemoved(semester, name, "assignments"))
      {
         createTab(semester, name, currentTable, "assignments", "Assignments");
      }
   }

   // Make the Contacts link
   if (currentCourse.contacts != null)
   {
      if (!isRemoved(semester, name, "contacts"))
      {
         createTab(semester, name, currentTable, "contacts", "Contacts");
      }
   }

   // Make the Tools link
   if (currentCourse.tools != null)
   {
      if (!isRemoved(semester, name, "tools"))
      {
         createTab(semester, name, currentTable, "tools", "Tools");
      }
   }
}