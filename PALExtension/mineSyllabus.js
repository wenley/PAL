function mineSyllabus(link, course) {

   var req = new XMLHttpRequest();
   req.open("GET", link, true);

   req.onreadystatechange = function () {
      if (req.readyState == 4 && req.status == 200) {
         XMLdecrement();

         var text;
         var name = "";
         var link = "";

         text = req.responseText;
         text = cleanLink(text);

         var loc = text.indexOf("<div class=\"container clearfix", 0);
         var start = text.indexOf("<h3>", loc);
         var end = text.indexOf("<\/h3>", start);
         var current = text.slice(start, end);
         current = current.concat("<\/h3>");
         var miniDoc = parser.parseFromString(current, "text/xml");
         if (miniDoc.getElementsByTagName("span").length > 1)
            name = miniDoc.getElementsByTagName("span")[1].textContent;

         if (miniDoc.getElementsByTagName("a").length > 0)
         {
            link = miniDoc.getElementsByTagName("a")[0].getAttribute("href");
         }

         else {
            start = text.indexOf("<div class=\"details", end);
            end = text.indexOf("<\/div>", start);
            current = text.slice(start, end);

            if (text.indexOf("<div class=\"vtbegenerated", start) != -1 &&
                text.indexOf("<div class=\"vtbegenerated", start) < end)
               current = current.concat("<\/div><\/div>");
            else current = current.concat("<\/div>");
            current = current.replace(/<img[^>]*>/g,"");
            miniDoc = parser.parseFromString(current, "text/xml");
            if (miniDoc.getElementsByTagName("a").length > 0)
            {
               link = miniDoc.getElementsByTagName("a")[0].getAttribute("href");
            }
            else
            {
               course.syllabusDoc = null;
               return;
            }
         }

         var doc = new Document();
         doc.name = name;
         doc.link = link;

         course.syllabusDoc = doc;
      }
   }
   req.send();
   XMLincrement();
}