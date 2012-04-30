// Author: Prerna Ramachandra
// Written: 20 April 2012
// newPopulate.js

// Populates template.html
function populate() {
   var ul = document.body.getElementsByClassName("sideBarSemesters")[0];
   var sideBar = document.getElementById("sideBar");

   var refreshButton = document.createElement("button");
   refreshButton.setAttribute("id", "refreshButton");

   refreshButton.innerText = "Refresh Courses";
   refreshButton.addEventListener("click", function() { refresh(); }, false);
   sideBar.appendChild(refreshButton);

   var sems = new Array();
   for(var entry in Courses) {
      sems.push(entry);
   }
   sems = sortSemesters(sems);
   console.log(sems);
   for (var i = 0; i < sems.length; i++) {
      var entry = sems[i];
      var li = document.createElement("li");
      var iLink = document.createElement("a");

      iLink.innerText = entry;
      console.log("This is the populate entry" + entry);
      iLink.addEventListener("click", function() { expandSemester(this); }, false);
      li.appendChild(iLink);
      ul.appendChild(li);
   }

   //  Default expand first semester and first course in first semester
   expandSemester(ul.children[0].children[0]);
   populateCourse(ul.children[0].children[1].children[0].children[0]);
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