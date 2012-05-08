// Author: Prerna Ramachandra
// Written: 20 April 2012
// newPopulate.js

// Populates template.html
function populate(state) {
   var ul = document.body.getElementsByClassName("sideBarSemesters")[0];
   var sideBar = document.getElementById("sideBar");

   var refreshButton = document.createElement("button");
   refreshButton.setAttribute("id", "refreshButton");

   refreshButton.innerText = "Restart PAL";
   refreshButton.addEventListener("click", function() { refresh(); }, false);
   sideBar.appendChild(refreshButton);

   var liteRefreshButton = document.createElement("button");
   liteRefreshButton.setAttribute("id", "liteRefreshButton");
   
   liteRefreshButton.innerText = "Refresh Courses";
   liteRefreshButton.addEventListener("click", function() { mineFromLinks();}, false);
   sideBar.appendChild(liteRefreshButton);

   var iceButton = document.createElement("button");
   iceButton.setAttribute("id", "iceButton");
   iceButton.innerText = "Integrated Course Engine";
   iceButton.addEventListener("click", function() { populateIframeBack("http://ice.tigerapps.org/");}, false);
   sideBar.appendChild(iceButton);

   var piazzaButton = document.createElement("button");
   piazzaButton.setAttribute("id", "piazzaButton");
   piazzaButton.innerText = "Piazza";
   piazzaButton.addEventListener("click", function() { populateIframeBack("http://piazza.com/");}, false);
   sideBar.appendChild(piazzaButton);

  var sems = new Array();
   for(var entry in Courses) {
      sems.push(entry);
   }
   sems = sortSemesters(sems);
   for (var i = 0; i < sems.length; i++) {
      var entry = sems[i];
      var li = document.createElement("li");
      var iLink = document.createElement("a");

      iLink.innerText = entry;
      iLink.addEventListener("click", function() { expandSemester(this); }, false);
      li.appendChild(iLink);
      ul.appendChild(li);
   }

   //  Default expand first semester and first course in first semester
   var semEl = ul.children[0].children[0];
   if (state != null && state.semester != null) {
      for (var i = 0; i < ul.children.length; i++) {
         var li = ul.children[i];
         if (li.children[0].innerText == state.semester) {
            semEl = li.children[0];
            break;
         }
      }
   }
   else if (isFuture(semEl.innerText))
      semEl = ul.children[1].children[0];

   expandSemester(semEl);
   if (state != null && state.course != null) {
      var ulCourses = semEl.parentElement.children[1];
      for (var i = 0; i < ulCourses.children.length; i++) {
         var liCourse = ulCourses.children[i];
         if (liCourse.children[0].innerText == state.course) {
            populateCourse(liCourse.children[0], state);
            break;
         }
      }
   }
   else
      populateCourse(semEl.parentElement.children[1].children[0].children[0]);
}

//  Sorts the semesters and returns a new version of the array in reverse order
function sortSemesters(sems) {
   var translator = new Object();
   var proxy = new Array();
   for (var i = 0; i < sems.length && sems[i] != undefined; i++) {
      var num = parseInt(sems[i].substr(1));
      if (sems[i][0] == 'F')
         num += 0.5;
      translator[num] = sems[i];
      proxy.push(num);
   }
   
   proxy.sort(function(a, b) { return b - a; });
   for (var i = 0; i < proxy.length; i++) {
      sems[i] = translator[proxy[i]];
   }
   return sems;
}

//  Detects if a particular semester is in the future
//  !!! Might be buggy
function isFuture(sem) {
   var d = new Date();
   var currYear = d.getFullYear();
   var year = parseInt(sem.substr(1));

   //  If semester is a year ahead, obviously future
   if (currYear < year)
      return true;

   var currMonth = d.getMonth();
   var fallSpring = sem[0];

   if (fallSpring == 'S') {
      //  If semester is spring and current month is January (1)
      if (currMonth <= 1)
         return true;
   }
   else if (fallSpring == 'F') {
      //  If semester is fall and current month is before June (6)
      if (currMonth <= 6)
         return true;
   }
   return false;
}