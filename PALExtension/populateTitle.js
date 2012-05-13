// Author: Masha Okounkova

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
   
  // make the logout button
   var logoutButtonElem = document.createElement("div");
   logoutButtonElem.setAttribute("id", "logoutButtonElem");
 
// make the logout of CAS button
   var casLogoutButton = document.createElement("button");
   casLogoutButton.setAttribute("id", "casLogoutButton");
   var casLogoutLink = document.createElement("a");
   casLogoutLink.addEventListener("click", function () {
         port.postMessage({ note: "logout" });
         document.location.href = "https://fed.princeton.edu/cas/logout";
      }, false);
   casLogoutLink.innerText = "Logout";
   casLogoutButton.appendChild(casLogoutLink);
   logoutButtonElem.appendChild(casLogoutButton); //!!

   var titleTextElem = document.createElement("div");
   var courseDescriptionElem = document.createElement("div");
   var courseDescriptionLink = document.createElement("a");
   courseDescriptionElem.setAttribute("id", "mainTitleCourseDescription");
   courseDescriptionLink.innerText = "Course Description";
   courseDescriptionLink.addEventListener("click", function() { populateIframeBack(link); }, false);
   courseDescriptionElem.appendChild(courseDescriptionLink);
   
   titleElem.appendChild(logoutButtonElem);
   titleTextElem.innerText = title;
   titleTextElem.appendChild(courseDescriptionElem);
   titleElem.appendChild(titleTextElem);
 
   tabBar.appendChild(titleElem);
}

function populateIframeBack(link) {
   
   var spaceToPopulate = document.getElementById("notTabBar");
   spaceToPopulate.innerHTML = "";

   addBackLink(link);

   var f1 = document.createElement("iframe");
   f1.setAttribute("height", "100%");
   f1.setAttribute("width", "100%");
   f1.setAttribute("src", link);
   spaceToPopulate.appendChild(f1);
}  

function addBackLink() { 

   var spaceToPopulate = document.getElementById("notTabBar");

   var backElem = document.createElement("div");
   backElem.setAttribute("id", "backElem");
   var backLink = document.createElement("a");
   backLink.innerText = "Return to " + selectedTab.innerText;
   backLink.addEventListener("click", function() { populateFromTab(selectedTab); }, false);
   backElem.appendChild(backLink);
   spaceToPopulate.appendChild(backElem);   
}                            

function populateIframe(link) {

   var spaceToPopulate = document.getElementById("notTabBar");
   spaceToPopulate.innerHTML = "";
   var f1 = document.createElement("iframe");
//   f1.setAttribute("height", "100%");
//   f1.setAttribute("width", "100%");
   f1.setAttribute("class", "tool");
   f1.setAttribute("src", link);
//   f1.setAttribute("onload", "cropRegistrar(this);");
//   f1.addEventListener("load", function () { cropRegistrar(this); });
   spaceToPopulate.appendChild(f1);
}

//  Crops registrar page information to fit without horizontal scrollbar
function cropRegistrar(iframeEl) {
   console.log("Cropping called!");
   console.log(iframeEl);
   for (var entry in iframeEl)
      console.log(entry);
   var cDoc = iframeEl.contentDocument;
   console.log(cDoc);
}

