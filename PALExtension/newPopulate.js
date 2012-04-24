// Author: Prerna Ramachandra
// Written: 20 April 2012
// newPopulate.js

// Populates template.html

function populate() {
      var ul = document.body.getElementsByClassName("sideBarSemesters")[0];
      console.log(ul);
      for(var entry in Courses) {
         console.log(Courses[entry]);
         var li = document.createElement("li");
         var iLink = document.createElement("a");

         iLink.setAttribute("href", "javascript:expandSemester('"+entry+"')");
         iLink.innerText = entry;
         li.appendChild(iLink);
         ul.appendChild(li);
      }
}