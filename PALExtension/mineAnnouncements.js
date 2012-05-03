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
   
   req.onreadystatechange = function () {
      if(req.readyState == 4 && req.status == 200) {
         XMLdecrement();

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
         allAnnouncements = store.slice(startAnnouncements, endannouncements);
         startEachAnnouncement = allAnnouncements.indexOf("<li class=", 0);
         while(startEachAnnouncement < endAnnouncements) {
            var a = new Announcement();
            endEachAnnouncement = store.indexOf("</li>", startEachAnnouncement);
            eachAnnoucnement = store.slice(startEachAnnouncement, endEachAnnouncement) + "</li>";
            tempEnd = eachAnnouncement.indexOf("</h3>", startEachAnnouncement);
            a.heading = eachAnnouncement.slice(startEachAnnouncement, tempEnd);
            a.heading = strip_tags(a.heading);

            startEachAnnouncement = eachAnnouncement.indexOf("Posted on", tempEnd);
            tempEnd = eachAnnouncement.indexOf("<div class=\"vtbegenerated\">", startEachAnnouncement);
            a.date = eachAnnouncement.slice(startEachAnnouncement, tempEnd);
            a.date = strip_tags(a.date);

            startEachAnnouncement = tempEnd;
            tempEnd = eachAnnouncement.indexOf("</div>", startEachAnnouncement);
            a.message = eachAnnouncement.slice(startEachAnnouncement, tempend);
            a.message = strip_tags(a.message);

            startEachAnnouncement = eachAnnouncement.indexOf("Posted by", tempEnd);
            tempEnd = eachAnnouncement.indexOf("Posted To", startEachAnnouncement);
            a.postedBy = eachAnnouncement.slice(startEachAnnouncement, tempEnd);
            a.postedBy = strip_tags(a.postedBy);

            startEachAnnouncement = tempEnd;
            a.postedTo = eachAnnouncement.slice(startEachAnnouncement, endEachAnnouncement);
            a.postedTo = strip_tags(a.postedTo);

            startEachAnnouncement = allAnnouncement.indexOf("<li class=", endEachAnnouncmeent);
         }
/*
            var cleaned = HTMLtoXML(a.message + "</li>");
            var miniDoc = parser.parseFromString(cleaned, "text/xml");
            var spans = miniDoc.getElementsByTagName("div");
            for (var i = 0; i < spans.length; i++) {
               var divEl = spans[i];
               if (divEl.getAttribute("class") == "vtbegenerated") {
                  a.messsage = divEl.textContent;
                  break;
               }
            }
*/            console.log(course.key);
            //           console.log(miniDoc);
            // console.log(a);
            startEachAnnouncement = store.indexOf("<li>", endEachAnnouncement);
            
/*
            a.message = a.message.replace("</div>", "", "g");
            a.message = a.message.replace("<div class=\"announcementInfo\">", "", "g");
            a.message = a.message.replace("<div class=\"details\">", "", "g");
            a.message = a.message.replace("<div class=\"vtbegenerated\">", "");
            a.message = cleanLink(a.message);
            console.log(a.message);
            var miniDoc = parser.parseFromString(a.message, "text/xml"); 
            console.log(miniDoc); */
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
