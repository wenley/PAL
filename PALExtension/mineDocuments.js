function mineDocuments(link, course, type, name, index) {

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
            if (start == -1)
               break;
            var end = text.indexOf("<\/h3>", start);
            if (end == -1)
               break;
            var current = text.slice(start, end);
            current = current.concat("<\/h3>");
            if (imgType == "release") { //  !!!
               console.log(current); //  !!!
            }

            var miniDoc = parser.parseFromString(current, "text/xml");
            if (miniDoc.getElementsByTagName("span").length > 1)
               Name = miniDoc.getElementsByTagName("span")[1].textContent;

            //  Get link inside <h3> if it exists
            var h3link;
            if (miniDoc.getElementsByTagName("a").length > 0)
               h3link = miniDoc.getElementsByTagName("a")[0].getAttribute("href");

            //  Get stuff inside of <div class="details...> if it exists
            var docLinks = new Array();
            var Memo = null;
            var check = text.indexOf("<h3>", end);
            var attempt = text.indexOf("<div class=\"details", end);
            if (attempt != -1 && (attempt < check || check == -1))
            {
               start = attempt;
               end = text.indexOf("<\/div>", start);
               var otherDiv = text.indexOf("<div", start + 1);
               while (otherDiv < end) {
                  end = text.indexOf("</div", end + 1);
                  otherDiv = text.indexOf("<div", otherDiv + 1);
               } //  Get true end of details
               current = text.slice(start, end) + "</div>";

               current = current.replace(/<img[^>]*>/g,"");
               while (current.indexOf("<style") != -1) {
                  var styleStart = current.indexOf("<style");
                  var styleEnd = current.indexOf("</style>");
                  current = current.substr(0, styleStart) + current.substr(styleEnd + 8);
               }
               var success = false;
               try {
                  current = current.replace(/<o:[^>]*>[^<]*<\/o:[^>]*>/g, ""); //  Take out funky tags
                  current = current.replace(/<\s+/g, ""); //  Take out leading white-space in tags

                  var temp = HTMLtoXML(current);
                  current = temp;
                  success = true;
               } catch (e) {
                  console.warn(course.key + ":: " + type + ":: ERROR");
                  console.warn(e);
               }
               if (success == false)
                  console.warn("Failed to parse correctly");

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
               {
                  var memoArray = new Array();
                  var children = new Array();
                  children = miniDoc.getElementsByTagName("div")[1].childNodes;
                  var length = children.length;
                  for (var i = 0; i < length; i++)
                  {
                     if (children[i].textContent != null && children[i].textContent != undefined)
                     {
                        memoArray.push(children[i].textContent);
                     }
                  }
                  Memo = memoArray.join("<br/>");
               }
//                  Memo = miniDoc.getElementsByTagName("div")[1].textContent;
            }

            if (imgType == "folder") {
               var f = new Folder();
               f.name = Name;
               f.key = course.key;
               f.link = h3link;
               mineDocuments(h3link, f, "Folder");
               docs.push(f);
            }
            else if (imgType == "document") {
               var m = new Material();
               m.name = Name;
               m.contents = docLinks;
               m.memo = Memo;
               docs.push(m);
            }
            else if (imgType == "assignment") {
               var a = new Assignment();
               a.name = Name;
               if (h3link.match(/http/) != null || h3link.match(/webapps/) == null) {
                  console.warn("This isn't really a submission link");
                  var c = new Document();
                  c.name = a.name;
                  c.link = h3link;
                  docLinks.push(c);
                  a.submissionLink = null;
               }
               else {
                  a.submissionLink = h3link;
               }
               a.contents = docLinks;
               a.memo = Memo;
               docs.push(a);
            }
            else if (imgType == "file") {
               var d = new Document();
               d.name = Name;
               d.link = h3link;
               docs.push(d);
            }
            else if (imgType == "generic") { //  No image; skipped over
               var g = new Assignment();
               g.name = Name;
               g.submissionLink = h3link;
               g.contents = docLinks;
               docs.push(g);
            }
            else if (imgType == "link") {
               var l = new Assignment();
               l.name = Name;
               l.submissionLink = h3link;
               if (docLinks.length > 0) {
                  console.warn(course.key + ": " + type + ": docsLinks for a link image is not empty");
                  console.log(docLinks);
               }
               l.memo = Memo;
               l.isLink = "isLink";
               docs.push(l);
            }
            else if (imgType == "survey") {
               var s = new Survey();
               s.name = Name;
               s.link = h3link;
               s.memo = Memo;
               docs.push(s);
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
         if (type == "other") {
            docs.unshift(name);
            course.otherLinks[index] = docs;
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
