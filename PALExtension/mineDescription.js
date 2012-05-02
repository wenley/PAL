//  Author: Wenley Tong
//  Written: 6 April 2012

//  Takes course content document's sidebar link for Course Description
//  Gets link to registrar's course description page
function mineCourseDescription(sidebarLink, course) {
   var req = new XMLHttpRequest();
   req.open("GET", sidebarLink, true);
   req.onreadystatechange = function () {
      if (req.readyState == 4 && req.status == 200) {
         XMLdecrement();
         var line = req.responseText.match(/window.open(.*);/g);
         if (line == null) {
            line = req.responseText.match(/window.location(.*);/g);
            if (line == null) {
               console.warn(course.key + ": No registrar link found");
               return;
            }
         }
         var link = line[0].match(/"https:[^\"]*"/g)[0].slice(1, -1);
         course.descriptionLink = link;
      }
      else if (req.readyState == 4 && req.status != 200)
      {
         console.warn(course.key + "Error, status is: " + req.status);
         XMLdecrement();
      }
   }
   req.send();
   XMLincrement();
}