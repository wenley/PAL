// Author: Masha Okounkova

function removeTab(semester, name, tab) {

   if (Courses[semester] == null || Courses[semester] == undefined)
      throw "Improper usage: invalid semester name";
   if (Courses[semester][name] == null || Courses[semester][name] == null)
      throw "Improper usage: invalid course name";

   var currentCourse = Courses[semester][name];
   cleanObj(currenCourse);

   var currentTab = document.getElementsByName(tab)[0];
   currentTab.parentNode.removeChild(currentTab);
   currentCourse.removedTabs.push(tab);
   console.log("Removed " + tab + " from " + currentCourse); 
}

function isRemoved(semester, name, tab) {

   if (Courses[semester] == null || Courses[semester] == undefined)
      throw "Improper usage: invalid semester name";
   if (Courses[semester][name] == null || Courses[semester][name] == null)
      throw "Improper usage: invalid course name";

   var currentCourse = Courses[semester][name];
   cleanObj(currenCourse);
   
   var length = currentCourse.removedTabs.length;
   for (var i = 0; i < length; i++)
   {
      if (currentCourse.removedTabs[i] == tab)
         return true;
   } 
   return false;
}


