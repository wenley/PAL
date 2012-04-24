// Author: Prerna Ramachandra
// Written: 20 April 2012
// newPopulate.js

// Populates template.html

function populate() {
      var ul = document.getElementsByClassName("sideBarSemesters")[0];
      for(var entry in courses) {
         console.log(courses[entry]);
         var li = document.createElement("li");
         var el = document.createElement("div");
         var iLink = document.createElement("a");

         iLink.setAttribute("href", "javascript:expandSemester('"+entry+"')");
         iLink,innerText = entry;
         el.appendChild(iLink);
         li.appendChild(el);
         ul.appendChild(li);
      }
}