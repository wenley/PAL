// Author: Masha Okounkova

function addTab(linkEl) {

   // need to get to the th tag
   var tabEl = linkEl.parentElement.parentElement.parentElement.parentElement.parentElement;
   var semester = tabEl.getAttribute("semester");
   var name = tabEl.getAttribute("name");
   // The tab to be restored - this is the attribute
   var attribute  = linkEl.getAttribute("attribute");

   // This is a course
   if (Courses[semester] == null || Courses[semester] == undefined)
      throw "Improper usage: invalid semester name";
   if (Courses[semester][name] == null || Courses[semester][name] == undefined)
      throw "Improper usage: invalid course name";

   var currentCourse = Courses[semester][name];
   cleanObj(currentCourse);

   // First, put it back in the table
   var currentTable = document.getElementById("courseTabTable");
   currentTable = currentTable.getElementsByTagName("tbody")[0];
   currentTable = currentTable.getElementsByTagName("tr")[0];

   var tabText = "";
   switch(attribute)
   {
      case "announcements":
         tabText = "Announcements";
         break;
      case "courseMaterials":
         tabText = "Course Materials";
         break;
      case "assignments":
         tabText = "Assignments";
         break;
      case "syllabusDoc":
         tabText = "Syllabus";
         break;
         //case "descriptionLink":
         //tabText = "Course Description";
         //break;
      case "contacts":
         tabText = "Contacts";
         break;
      case "tools":
         tabText = "Tools";
         break;
   }

   createTab(semester, name, currentTable, attribute, tabText);
   
   // Then, put it back in the order and remove it from the 
   // removed list
   var length = currentCourse.tabOrder["length"];
   currentCourse.tabOrder[length] = attribute;
   currentCourse.tabOrder[attribute] = length;
   currentCourse.tabOrder["length"] = length + 1;
   
   var remLength = currentCourse.removedTabs.length;
   for (var i = 0; i < remLength; i++)
   {
      if (currentCourse.removedTabs[i] == attribute)
      {
         for (var j = i; j < remLength; j++)
         {
            currentCourse.removedTabs[j] = currentCourse.removedTabs[j + 1];
         }
         currentCourse.removedTabs[remLength] = null;
         break;
      }
   }

   removedPopup(semester, name);
}
