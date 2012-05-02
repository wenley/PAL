// Author: Prerna Ramachandra
// 9 April 2012

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
         var i = 0;

         startAnnouncements = store.indexOf("<ul id=\"announcementList\" class=\"announcementList announcementList-read\"");
         if(startinfo == -1)
            return;
         endAnnouncements = startAnnouncements;
         endEachAnnouncement = startAnnouncements;
         startEachAnnouncement = store.indexOf("<li>", endEachAnnouncement);
         while(startEachAnnouncement < endAnnouncements) {
            var a = new Announcement();
            endEachAnnouncement = store.indexOf("</li>", startEachAnnouncement);
            a.message = store.slice(startEachAnnouncement, endEachAnnouncement);
            a.message = a.message.replace("</div>", "", "g");
            a.message = a.message.replace("<div class=\"announcementInfo\">", "", "g");
            a.message = a.message.replace("<div class=\"details\">", "", "g");
            startEachAnnouncement = store.indexOf("<li>", endEachAnnouncement);
            a.message = cleanLink(a.message);
            var miniDoc = parser.parseFromString(a.message, "text/xml"); 
            announcement[i] == a;
            i++;
         }
         course.announcements = announcements;
      }
   }
   req.send();
   XMLincrement();
}
