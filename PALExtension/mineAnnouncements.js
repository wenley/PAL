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
         var annChunk;

         //  Find beginning of announcement list
         startAnnouncements = store.indexOf("<ul id=\"announcementList");
         if(startAnnouncements == -1)
            return;

         //  Find end of announcement list
         var otherul = store.indexOf("<ul", startAnnouncements + 1); //  See if there are any nested uls
         endAnnouncements = store.indexOf("</ul", startAnnouncements);
         while (otherul < endAnnouncements) {
            endAnnouncements = store.indexOf("</ul", endAnnouncements + 1);
            otherul = store.indexOf("<ul", otherul + 1);
         } //  Find proper closing ul

         //  Grab chunk containing all announcements
         annChunk = store.slice(startAnnouncements, endAnnouncements) + "</ul>";
         startEachAnnouncement = annChunk.indexOf("<li class=\"clearfix");
         
         var terminator = 0;
         while (startEachAnnouncement != -1 && terminator++ < 10) {
            var a = new Announcement();

            //  Find proper chunk of a single announcement
            var endEachAnnouncement = annChunk.indexOf("</li", startEachAnnouncement);
            var otherli = annChunk.indexOf("<li", startEachAnnouncement + 1);
            while (otherli < endEachAnnouncement) {
               endEachAnnouncement = annChunk.indexOf("</li", endEachAnnouncement + 1);
               otherli = annChunk.indexOf("<li", otherli + 1);
            }
            var chunk = annChunk.slice(startEachAnnouncement, endEachAnnouncement) + "</li>";

            //  Convert the chunk to a miniDoc
            var miniDoc = null;
            try {
               var cleanChunk = HTMLtoXML(cleanObj(chunk));
               cleanChunk = cleanLink(cleanChunk);
               miniDoc = parser.parseFromString(cleanChunk, "text/xml");
            } catch (e) {
               console.warn(e);
            }

            //  
            if (miniDoc == null || miniDoc.getElementsByTagName("parsererror").length > 0) {
               console.log("Couldn't parse correctly");
            }
            else {
               var heading = miniDoc.getElementsByTagName("h3")[0];
               if (heading != undefined) {
                  a.heading = strip(heading.textContent);
               }

               var divs = miniDoc.getElementsByTagName("div");
               for (var i = 0; i < divs.length; i++) {
                  var divEl = divs[i];
                  var elClass = divEl.getAttribute("class");
                  if (elClass != null && elClass[0] == "v") {
                     var parentClass = divEl.parentElement.getAttribute("class");
                     if (parentClass != undefined && parentClass[0] != "v") {
                        a.message = divEl.textContent;
                     }
                  }
                  else if (elClass == "details") {
                     var ps = divEl.getElementsByTagName("p");
                     for (var j = 0; j < ps.length; j++) {
                        var pEl = ps[j];
                        if (pEl.textContent.match(/Posted on:/) != null) {
                           a.date = pEl.textContent;
                           break;
                        }
                     }
                  }
                  else if (elClass == "announcementInfo") {
                     var ps = divEl.getElementsByTagName("p");
                     for (var j = 0; j < ps.length; j++) {
                        var pEl = ps[j];
                        if (pEl.textContent.match(/Posted by:/) != null) {
                           a.postedBy = pEl.textContent;
                           break;
                        }
                     }
                  }
               }
               announcements.push(a);
            }

            //  Try to find the next announcement
            if (endEachAnnouncement == -1)
               break;
            else
               startEachAnnouncement = annChunk.indexOf("<li", endEachAnnouncement);
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
