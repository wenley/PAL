// Author: Masha Okounkova

function minePiazza(course) {

   var semester = course.title.match(/[F|S][0-9]{4}/)[0];
   var names = course.title.match(/[A-Z]{3}[0-9]{3}/g);

   for (var i = 0; i < names.length; i++)
   {
      name = names[i];

      // Create the Supposed URL
      var piazzaLink = "http://piazza.com/class#"; //spring2012/cos333
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

      // Check if URL exists
      var req = new XMLHttpRequest();

      req.open("GET", piazzaLink, true);
      console.log("got down to here... ..");
      req.onreadystatechage = function () {
         if (req.readyState == 4 && req.status == 200)
         {
            XMLdecrement();
            console.log("There is a piazza link for ");
            currentCourse.piazzaLink = piazzaLink;
            return;
         }
         else if (req.readyState == 4 && req.status != 200)
         {
            XMLdecrement();
            console.log("No piazza thus far link for ");
         }
      }
      req.send();
      XMLincrement();
      console.log("Did an iteration");
   }
      console.log("yeeeee");*/
}