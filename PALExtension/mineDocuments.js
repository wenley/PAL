function mineDocuments(link, course, type) {

   var req = new XMLHttpRequest();
   req.open("GET", link, true);

   req.onreadystatechange = function () {
      if (req.readyState == 4 && req.status == 200) {
         XMLdecrement();

         var text;

         text = req.responseText;
         text = cleanLink(text);

         // Mine the names into docs
         var loc = text.indexOf("<div class=\"container clearfix", 0);
         var docs = new Array();
         for (var i = 0; i < 1000; i++)
         {
            var imgStart = text.indexOf("<img", loc);
            if (imgStart == -1)
               break;
            var divStart = text.indexOf("<div", imgStart);
            var imgText  = text.slice(imgStart, divStart);
            var imgType = imgText.match(/\/\w+.gif/);
            if (imgType == null) {
               console.warn("No associated image...");
               break;
            }
            imgType = imgType[0].match(/\/[^_]*/)[0];
            imgType = imgType.slice(1);
            //  Get Name of <li> entry
            var Name;
            var start = text.indexOf("<h3>", loc);
            var end = text.indexOf("<\/h3>", start);
            var current = text.slice(start, end);
            current = current.concat("<\/h3>");
            if (imgType == "release") //  !!!
               console.log(current); //  !!!
            
            var miniDoc = parser.parseFromString(current, "text/xml");
            if (miniDoc.getElementsByTagName("span").length > 1)
               Name = miniDoc.getElementsByTagName("span")[1].textContent;

            //  Get link inside <h3> if it exists
            var h3link;
            if (miniDoc.getElementsByTagName("a").length > 0)
               h3link = miniDoc.getElementsByTagName("a")[0].getAttribute("href");

            //  Get stuff inside of <div class="details...> if it exists
            var docLinks = new Array();
            var Memo;
            var check = text.indexOf("<h3>", end);
            var attempt = text.indexOf("<div class=\"details", end);
            if (attempt != -1 && (attempt < check || check == -1))
            {
               start = attempt;
               end = text.indexOf("<\/div>", start);
               current = text.slice(start, end);
               if (text.indexOf("<div class=\"vtbegenerated", attempt) != -1 &&
                   text.indexOf("<div class=\"vtbegenerated", attempt) < end)
                  current = current.concat("<\/div><\/div>");
               else current = current.concat("<\/div>");
               current = current.replace(/<img[^>]*>/g,"");
               try {
                  var temp = HTMLtoXML(current);
                  current = temp;
               } catch (e) {
                  console.warn(course.key + ":: " + type + ":: ERROR");
                  console.warn(e);
               }
               miniDoc = parser.parseFromString(current, "text/xml");
               var FileLinks = miniDoc.getElementsByTagName("a");
               for (var j = 0; j < FileLinks.length; j++) {
                  var doc = new Document();
                  if (FileLinks[j].innerText != undefined)
                     doc.name = FileLinks[j].innerText;
                  else if (FileLinks[j].textContent != undefined)
                     doc.name = FileLinks[j].textContent;
                  else {
                     console.warn("Unknown document name");
                     doc.name = "Unnamed";
                  }
                  doc.link = FileLinks[j].getAttribute("href");
                  docLinks[j] = doc;
               }
               if (miniDoc.getElementsByTagName("div").length > 1)
                  Memo = miniDoc.getElementsByTagName("div")[1].textContent;
            }

            if (imgType == "folder") {
               var f = new Folder();
               f.name = Name;
               f.key = course.key;
               f.link = h3link;
               mineDocuments(h3link, f, "Folder");
               docs[docs.length] = f;
            }
            else if (imgType == "document") {
               var m = new Material();
               m.name = Name;
               m.contents = docLinks;
               m.memo = Memo;
               docs[docs.length] = m;
            }
            else if (imgType == "assignment") {
               var a = new Assignment();
               a.name = Name;
               a.submissionLink = h3link;
               a.contents = docLinks;
               a.memo = Memo;
               docs[docs.length] = a;
            }
            else if (imgType == "file") {
               var d = new Document();
               d.name = Name;
               d.link = h3link;
               docs[docs.length] = d;
            }
            else if (imgType == "generic") { //  No image; skipped over
               var g = new Assignment();
               g.name = Name;
               g.submissionLink = h3link;
               g.contents = docLinks;
               docs[docs.length] = g;
            }
            else if (imgType == "link") {
               var l = new Assignment();
               l.name = Name;
               l.submissionLink = h3link;
               if (docLinks.length > 0) {
                  console.warn("docsLinks for a link image is not empty");
                  console.log(docLinks);
               }
               l.memo = Memo;
               l.isLink = "isLink";
               docs[docs.length] = l;
            }
            else
               console.warn(course.key + ":: Unrecognized image type: " + imgType);
            loc = end;
         }

         //  Store away findings
         if (type == "Folder")
            course.contents = docs;
         if (type == "Assignments")
            course.assignments = docs;
         if (type == "Course Materials")
            course.courseMaterials = docs;
         if (type == "Syllabus") {
            try {
               course.syllabusDoc = docs[0];
            } catch (e) {
               console.warn("No syllabus.");
               course.syllabusDoc = null;
            }
         }
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
