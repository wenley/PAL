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

   for(var entry in Courses) {
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