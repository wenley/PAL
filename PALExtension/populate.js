// Author: Prerna Ramachandra
// Written: 20 April 2012
// newPopulate.js
  
// Populates template.html
function populate() {
      var ul = document.body.getElementsByClassName("sideBarSemesters")[0];
      console.log(ul);

      function foo() { expandSemester(this.sem); };

      for(var entry in Courses) {
         console.log(Courses[entry]);
         var li = document.createElement("li");
         var iLink = document.createElement("a");

         iLink.innerText = entry;
         iLink.addEventListener("click", function() { expandSemester(this); }, false);
         li.appendChild(iLink);
         ul.appendChild(li);
      }
}