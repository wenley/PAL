function formatName(name) {
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

   var link = currentCourse.descriptionLink;

   var titleElem = document.createElement("div");
   titleElem.setAttribute("id", "mainTitle");
   var titleTextElem = document.createElement("div");
   var courseDescriptionElem = document.createElement("div");
   var courseDescriptionLink = document.createElement("a");
   courseDescriptionElem.setAttribute("id", "mainTitleCourseDescription");
   courseDescriptionLink.innerText = "Course Description";
   courseDescriptionLink.addEventListener("click", function() { populateIframe(link); }, false);
   //courseDescriptionLink.setAttribute("href", link);
   courseDescriptionElem.appendChild(courseDescriptionLink);
   titleTextElem.innerText = title;
   titleTextElem.appendChild(courseDescriptionElem);
   titleElem.appendChild(titleTextElem);
   tabBar.appendChild(titleElem);
}

function populateIframe(link) {

   var spaceToPopulate = document.getElementById("notTabBar");
   spaceToPopulate.innerHTML = "";
   var f1 = document.createElement("iframe");
//   f1.setAttribute("height", "100%");
//   f1.setAttribute("width", "100%");
   f1.setAttribute("class", "tool");
   f1.setAttribute("src", link);
   spaceToPopulate.appendChild(f1);
}