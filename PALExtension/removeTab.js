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

   var i = currentCourse.tabOrder[tab];
   var length = currentCourse.tabOrder["length"];
   for (i; i < length; i++)
   {
      var tempCourse1 = currentCourse.tabOrder[i];
      var tempCourse2 = currentCourse.tabOrder[i + 1];
      currentCourse.tabOrder[tempCourse1] = tempCourse2;
      currentCourse.tabOrder[i] = currentCourse.tabOrder[i + 1];
   }
   // The missing quotes are necessary in this case! 
   // We actually want index length!
   currentCourse.tabOrder[length] = undefined;
   currentCourse.tabOrder["length"] = length - 1; 
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


