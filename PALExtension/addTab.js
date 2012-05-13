// Author: Masha Okounkova
// To add tabs back in 

// Adds a tab back into the tab bar from the "+"
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
      case "contacts":
         tabText = "Contacts";
         break;
      case "tools":
         tabText = "Tools";
         break;
      default:
         tabText = attribute;
         break;
   }

   createTab(semester, name, currentTable, attribute, tabText);
   
   // Then, put it back in the order and remove it from the 
   // removed list

   for (var i = 0; i < 1000; i++)
   {
      if (currentCourse.removedTabs[i] == null || currentCourse.removedTabs[i] == undefined)
         break;
      if (currentCourse.removedTabs[i] == attribute)
      {
         var j = i;
         while (currentCourse.removedTabs[j + 1] != null &&  currentCourse.removedTabs[j + 1] != undefined)
         {
            currentCourse.removedTabs[j] = currentCourse.removedTabs[j + 1];
            j++;
         }
         currentCourse.removedTabs.pop()
         break;
      }
   }

   if (currentCourse.tabOrder == null || currentCourse.tabOrder == undefined)
   {
      currentCourse.tabOrder = new Array();
   }

   currentCourse.tabOrder.push(attribute);

   removedPopup(semester, name);

   pushCourse(currentCourse);
}
