// Author: Prerna Ramachandra
// Written: 23 April 2012
// expandSemester.js

// Expands the semesters to reveal courses for populate.js

function expandSemester(semesterEl) {
   var semester = semesterEl.innerText;
   var ul = document.createElement("ul");
   console.log(ul);
   for(var entry in Courses[semester]) {
     console.log(Courses[semester][entry]);
     var li = document.createElement("li");
     var iLink = document.createElement("a");

     iLink.setAttribute("href", "javascript:populateCourses('"+entry+"')");
     iLink.innerText = entry;
     li.appendChild(iLink);
     ul.appendChild(li);
      }
   semesterEl.appendChild(ul);
}