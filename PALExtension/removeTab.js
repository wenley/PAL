// Author: Masha Okounkova

//  Removes the tab that contains buttonEl
function removeTab(buttonEl) {

   var tabEl = buttonEl.parentElement.parentElement;
   tabEl.removeEventListener("click", populateFromTabWrapper, false);
   var semester = tabEl.getAttribute("semester");
   var name = tabEl.getAttribute("name");
   var attribute = tabEl.getAttribute("attribute");

   if (Courses[semester] == null || Courses[semester] == undefined)
      throw "Improper usage: invalid semester name: " + semester;
   if (Courses[semester][name] == null || Courses[semester][name] == null)
      throw "Improper usage: invalid course name: " + name;

   var currentCourse = Courses[semester][name];
   cleanObj(currentCourse);

   //  Note that the tab has been removed
   var currentTab = tabEl;
   currentTab.parentNode.removeChild(tabEl);
   if (currentCourse.removedTabs == undefined)
      currentCourse.removedTabs = new Array();
   currentCourse.removedTabs.push(attribute);

   //  Reorder tabOrder
   var index = 0;
   while (currentCourse.tabOrder[index] != null && currentCourse.tabOrder[index] != undefined)
   {
      if (currentCourse.tabOrder[index] == attribute)
         break;
      index++;
   }

   // now more all of the other tabs over
   while (currentCourse.tabOrder[index + 1] != null && currentCourse.tabOrder[index + 1] != undefined)
   {
      currentCourse.tabOrder[index] = currentCourse.tabOrder[index + 1];
      index++;
   }

   // delete the desired tab
   var popped = currentCourse.tabOrder.pop();

   removedPopup(semester, name);

   pushCourse(currentCourse);
}

//  Is the tab with semester, name, and attribute 'tab' removed?
function isRemoved(semester, name, tab) {
   if (Courses[semester] == null || Courses[semester] == undefined)
      throw "Improper usage: invalid semester name";
   if (Courses[semester][name] == null || Courses[semester][name] == null)
      throw "Improper usage: invalid course name";

   var currentCourse = Courses[semester][name];
   cleanObj(currentCourse);

   if (currentCourse.removedTabs == undefined || currentCourse.removedTabs.length == 0 ||
       currentCourse.removedTabs[0] == undefined)
      return false;

   var i = 0;
   while (currentCourse.removedTabs[i] != null && currentCourse.removedTabs[i] != undefined)
   {
      if (currentCourse.removedTabs[i] == tab)
         return true;
      i++;
   }
   return false;
}


