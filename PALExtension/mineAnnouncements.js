// Author: Prerna Ramachandra

// Mines announcements from each course
function mineAnnouncement(link, coursE) {
   var req = new XMLHttpRequest();
   req.open("GET", link, true);
   req.onreadystatechange = function() {
      if(req.readyState == 4 && req.status == 200) {
         req.send();
         var store = req.responseText;
         var startInfo = 0;
         var endInfo = 0;
         var startDetails = 0;
         var endDetails = 0;
         var startDate = 0;
         var endDate = 0;
         var tempEnd = 0;
         var postedBy;
         var postedTo;
         var message;
         var startHeading;
         var endHeading;
         var heading;

         while(starInfo != -1) {
            startInfo = store.indexOf("<div class=\"announcementInfo\">", startInfo);
            endInfo = store.indexOf("</div>", startInfo);
            tempEnd = store.indexOf("<p><span>Posted to:</span>", startInfo);
            postedBy = store.slice(startInfo, tempEnd);
            postedBy = postedBy.replace("<div class=\"announcementInfo\">", "");
            postedBy = postedBy.replace("<p><span>Posted by:</span>", "");
            postedBy = postedBy.replace("</p>", "");
            postedBy = postedBy.replace("&nbsp;", " ");
            postedTo = store.slice(tempEnd, endInfo);
            postedTo = postedTo.replace("<p><span>Posted to:</span>", "");
            postedTo = postedTo.replace("</p>", "");

