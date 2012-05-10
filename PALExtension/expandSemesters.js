// Author: Prerna Ramachandra
// Written: 23 April 2012
// expandSemester.js

// Expands the semesters to reveal courses for populate.js

function expandSemester(semesterEl) {
   //  To collapse a semester
   if (semesterEl.parentElement.children.length > 1) {
      semesterEl.parentElement.removeChild(semesterEl.parentElement.children[1]);
      return;
   }

   //  To expand a semester
   var semester = semesterEl.innerText;
   var ul = document.createElement("ul");
   for(var entry in Courses[semester]) {
     var li = document.createElement("li");
     var iLink = document.createElement("a");

     iLink.innerText = entry;
     iLink.setAttribute("semester", semester);
     iLink.addEventListener("click", function() { populateCourse(this); }, false);
     li.appendChild(iLink);
     ul.appendChild(li);
   }
   semesterEl.parentElement.appendChild(ul);

   showDiff();
}