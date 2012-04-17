// Author: Prerna Ramachandra
// 9 April 2012

// --- Mines announcements from Blackboard to reformat ---

function mineAnnouncements (link, course) {
   var req = new XMLHttpRequest;
   req.open("GET", link, true);
   
   req.onreadystatechange = function () {
      if(req.readyState == 4 && req.status == 200) {
   var announcements = new Array();

   var store = req.responseText;
   var startInfo = 0;
   var endInfo;
   var startDetails = 0;
   var endDetails = 0;
   var startDate = 0;
   var endDate;
   var tempEnd;
   var messageStart;
   var messageEnd;
   var headingStart = 0;
   var headingEnd;
   var i = 0;
  
   while(startInfo != -1) {
      var a = new Announcement();
      startInfo = store.indexOf("<div class =\"announcementInfo\">", startInfo);
      endInfo = store.indexOf("</div>", endDetails);
      tempEnd = store.indexOf("Posted to:", startInfo);
      a.postedBy = store.slice(startInfo, tempEnd);
      a.postedBy = a.postedBy.replace("<div class =\"announcementInfo\">", " ");
      a.postedTo = store.slice(tempEnd, endInfo);
      a.postedBy = a.postedBy.replace("<p><span>", "");
      a.postedBy = a.postedBy.replace("</span>", "");
      a.postedBy = a.postedBy.replace("</p>", "");
      a.postedTo = a.postedTo.replace("</span>", "");
      a.postedTo = a.postedTo.replace("</p>", "");

      startDetails = store.indexOf("<div class=\"details\">", startDetails);
      endDetails = store.indexOf("</div>", startDetails);
      startDate = store.indexOf("</span>", startDetails);
      endDate = store.indexOf("</p>", startDate);
      a.date = store.slice(startDate, endDate);
      a.date = a.date.replace("</span>", "");
      messageStart = store.indexOf("<div class =\"vtbegenerated\">", endDate);
      messageEnd = endDetails;
      a.message = store.slice(messageStart, messageEnd);
      a.message = a.message.replace("<p>", " ");
      a.message = a.message.replace("</p>", " ");
      a.message = a.message.replace("<div class \"vtbegenerated\">", "");

      headingStart = store.indexOf("transparent\">", endInfo);
      headingEnd = store.indexOf("</h3>", headingStart);
      a.heading = store.slice(headingStart, headingEnd);
      a.heading = a.heading.replace("transparent\">", "");

      announcements[i] = a;
      i++;
   }

   course.announcements = announcements;
      }
   }
   req.send();
}

