// Author: Prerna Ramachandra
// 9 April 2012

// Function to strip HTML tags from passed text
// Credit: Ryan Stemkoski, http://www.stemkoski.com/what-is-javascript%E2%80%99s-equivalent-to-php-strip_tags/
function strip_tags(html){
 
   //PROCESS STRING
   if(arguments.length < 3) {
      html=html.replace(/<\/?(?!\!)[^>]*>/gi, '');
   } else {
      var allowed = arguments[1];
      var specified = eval("["+arguments[2]+"]");
      if(allowed){
         var regex='</?(?!(' + specified.join('|') + '))\b[^>]*>';
         html=html.replace(new RegExp(regex, 'gi'), '');
      } else{
         var regex='</?(' + specified.join('|') + ')\b[^>]*>';
         html=html.replace(new RegExp(regex, 'gi'), '');
      }
   }
 
   //CHANGE NAME TO CLEAN JUST BECAUSE 
   var clean_string = html;
 
   //RETURN THE CLEAN STRING
   return clean_string;
}

// --- Mines announcements from Blackboard to reformat ---

function mineAnnouncements (link, course) {
   var req = new XMLHttpRequest();
   req.open("GET", link, true);
   console.log("Opening announcements");
   req.onreadystatechange = function () {
      if(req.readyState == 4 && req.status == 200) {
         XMLdecrement();
         console.log("passes if statement");
         var announcements = new Array();
         var store = req.responseText;
         var startAnnouncements = 0;
         var endAnnouncements = 0;
         var startEachAnnouncement = 0;
         var endEachannouncement = 0;
         var tempEnd = 0;
         var eachAnnouncement;
         var allAnnouncements;

         startAnnouncements = store.indexOf("<ul id=\"announcementList");
         if(startAnnouncements == -1)
            return;
         endAnnouncements = store.indexOf("</ul", startAnnouncements);
         allAnnouncements = store.slice(startAnnouncements, endAnnouncements);
         startAnnouncements = allAnnouncements.indexOf("<ul id=\"announcementList");
         startEachAnnouncement = allAnnouncements.indexOf("<li class=\"clearfix\"  id=\"_100134_1\">", startAnnouncements);
     
         while(startEachAnnouncement != -1) {
            var a = new Announcement();
            endEachAnnouncement = allAnnouncements.indexOf("</li>", startEachAnnouncement);
            eachAnnouncement = allAnnouncements.slice(startEachAnnouncement, endEachAnnouncement) + "</li>";
            tempEnd = eachAnnouncement.indexOf("<div class=\"details\">", startEachAnnouncement);
            a.heading = eachAnnouncement.slice(startEachAnnouncement, tempEnd);
            a.heading = strip_tags(a.heading);
            console.log(a.heading);
            startEachAnnouncement = eachAnnouncement.indexOf("Posted on", tempEnd);
            tempEnd = eachAnnouncement.indexOf("<div class=\"vtbegenerated\">", startEachAnnouncement);
            a.date = eachAnnouncement.slice(startEachAnnouncement, tempEnd);
            a.date = strip_tags(a.date);

            startEachAnnouncement = tempEnd;
            tempEnd = eachAnnouncement.indexOf("</div>", startEachAnnouncement);
            a.message = eachAnnouncement.slice(startEachAnnouncement, tempEnd);
            a.message = strip_tags(a.message);

            startEachAnnouncement = eachAnnouncement.indexOf("Posted by", tempEnd);
            tempEnd = eachAnnouncement.indexOf("Posted To", startEachAnnouncement);
            a.postedBy = eachAnnouncement.slice(startEachAnnouncement, tempEnd);
            a.postedBy = strip_tags(a.postedBy);

            startEachAnnouncement = tempEnd;
            a.postedTo = eachAnnouncement.slice(startEachAnnouncement, endEachAnnouncement);
            a.postedTo = strip_tags(a.postedTo);

            startEachAnnouncement = allAnnouncements.indexOf("<li class=\"clearfix\"  id=\"_100134_1\">", startAnnouncements);
         announcements.push(a);
         }
         course.announcements = announcements;
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