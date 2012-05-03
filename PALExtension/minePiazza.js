// Author: Masha Okounkova

function minePiazza(semester, name) {

   if (Courses[semester] == null || Courses[semester] == undefined)
      throw "Improper usage: invalid semester name";
   if (Courses[semester][name] == null || Courses[semester][name] == undefined)
      throw "Improper usage: invalid course name";

   var currentCourse = Courses[semester][name];
   cleanObj(currentCourse);

   // Create the Supposed URL
   var piazzaLink = "http://piazza.com/class#" //spring2012/cos333
   if (semester.charAt(0) == 'S'|| semester.charAt(0) == 's')
   {
      var season = "spring";
   }
   if (semester.charAt(0) == 'F' || semester.charAt(0) == 'f')
   {
      var season = "fall";
   }
   var year = semester.substring(1, 5);

   piazzaLink = piazzaLink + season + year + "/" + name;
   console.log("This is the piazzaLink " + piazzaLink);

    currentCourse.piazzaLink = piazzaLink;

   // Check if URL exists
   /*  var req = new XMLHttpRequest();
   XMLincrement();
   req.open("GET", piazzaLink, true);
   console.log("got down to here... ..");
   req.onreadystatechage = function () {
      if (req.readyState == 4 && req.status == 200)
      {
         XMLdecrement();
         console.log("There is a piazza link for ");
         currentCourse.piazzaLink = piazzaLink;
      }
      else if (req.readyState == 4 && req.status != 200)
      {
         XMLdecrement();
         console.log("No piazza link for ");
         return;
      }
   }
   req.send();
   console.log("yeeeee");*/
}