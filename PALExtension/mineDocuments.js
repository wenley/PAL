function mineDocuments(link, course, type) {

   var req = new XMLHttpRequest();
   req.open("GET", link, true);

   req.onreadystatechange = function () {
      if (req.readyState == 4 && req.status == 200) {

         var text;

         text = req.responseText;
         text = cleanLink(text);

         // Mine the names
         var loc = text.indexOf("<div class=\"container clearfix", 0);
         var start;
         var end;
         var check;
         var miniDoc;
         var current;
         var attempt;

         var Name;
         var Memo = "";
         var FileLinks = new Array();

         var assignments = new Array();
         var materials = new Array();

         for (var i = 0; i < 1000; i++)
         {
            start = text.indexOf("<h3>", loc);
            if (start == -1)
            {
               if (type == "Assignments")
               {
                  course.assignments = assignments;
               }
               if (type == "Course Materials")
                  course.courseMaterials = materials;

               if (type == "Syllabus")
               {
                  try {
                     course.syllabusDoc = DocCollection[0];
                  }
                  catch (e) {
                     console.warn("No syllabus.");
                     course.syllabusDoc = null;
                  }
               }

               break;
            }
            end = text.indexOf("<\/h3>", start);
            var DocCollection = new Array();           
            current = text.slice(start, end);
            current = current.concat("<\/h3>");
            miniDoc = parser.parseFromString(current, "text/xml");
            if (miniDoc.getElementsByTagName("span").length > 1)
               Name = miniDoc.getElementsByTagName("span")[1].textContent;
            var defstat = false;
            if (miniDoc.getElementsByTagName("a").length > 0)
            {
               FileLinks = miniDoc.getElementsByTagName("a");
               defstat = true;
            }
            check = text.indexOf("<h3>", end);
            attempt = text.indexOf("<div class=\"details", end);
            if (attempt != -1 && (attempt < check || check == -1) && defstat == false)
            {
               start = attempt;
               end = text.indexOf("<\/div>", start);
               current = text.slice(start, end);
               if (text.indexOf("<div class=\"vtbegenerated", attempt) != -1 &&
                   text.indexOf("<div class=\"vtbegenerated", attempt) < end)
                  current = current.concat("<\/div><\/div>");
               else current = current.concat("<\/div>");
               current = current.replace(/<img[^>]*>/g,"");
               miniDoc = parser.parseFromString(current, "text/xml");
               FileLinks = miniDoc.getElementsByTagName("a");
               if (miniDoc.getElementsByTagName("div").length > 1)
                  Memo = miniDoc.getElementsByTagName("div")[1].textContent;
            }
            for (var j = 0; j < FileLinks.length; j++)
            {
               var Doc = new Document();
               Doc.name = FileLinks[j].innerText;
               Doc.link = FileLinks[j].getAttribute("href");
               DocCollection[j] = Doc;
            }

            if (type == "Assignments")
            {
               var a = new Assignment();
               a.name = Name;
               a.fileLinks = DocCollection;
               a.memo = Memo;
               assignments[i] = a;
            }

            if (type == "Course Materials")
            {
               var m = new Material();
               m.name = Name;
               m.fileLinks = DocCollection;
               m.memo = Memo;
               materials[i] = m;
            }

            loc = end;
         }

      }
   }
   req.send();
}
