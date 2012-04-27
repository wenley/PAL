function formateName(name) {
   var a = name.substring(0,3);
   var b = name.substring(3,7);
   var c = a + " " + b;
   return c;
}

function formatSemester(semester) {
   var season = semester.substring(0, 1);
   var seasonx = "";
   if (season == "F")
      seasonx = "Fall";
   if (season == "S")
      seasonx == "Spring";
   var year = semester.substring(1, 5);
   var c = seasonx + " " + year;
   return c;
}

function populateTitle(semester, name) {

   if (Courses[semester] == null || Courses[semester] == undefined)
      throw "Improper usage: invalid semester name";
   if (Courses[semester][name] == null || Courses[semester][name] == undefined)
      throw "Improper usage: invalid course name";

   title = formatName(name);

   var currentCourse = Courses[semester][name];
   cleanObj(currentCourse);

   var tabBar = document.getElementById("tabBar");
   if (document.getElementById("mainTitle") != null)
   {
      var oldElem = document.getElementById("mainTitle");
      tabBar.removeChild(oldElem);
   }
   var divElem = document.createElement("div");
   divElem.setAttribute("id", "mainTitle");
   var pElem = document.createElement("p");
   pElem.innerText = title;
   divElem.appendChild(pElem);
   tabBar.appendChild(divElem);
}