function mineDocuments(link, course, type) {
   //console.log("The mine masha link is \n" + link);
   console.log("The mine masha course is \n" + course.title);

   var req = new XMLHttpRequest();
   req.open("GET", link, true);

   req.onreadystatechange = function () {
      if (req.readyState == 4 && req.status == 200) {

         console.log("Doing " + type + " for " + course.title);
         //var NameTemp  = new Array();
         //var NameFinal = new Array();
         //var LinkTemp  = new Array();
         //var LinkFinal = new Array();
         //var MemoTemp  = new Array();
         //var MemoFinal = new Array();

         //var textrm;
         //var txt;
         //var texttemp;

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
                  console.log("MASHA " + assignments);
                  course.assignments = assignments;
               }
               if (type == "Course Materials")
                  course.courseMaterials = materials;

               if (type == "Syllabus")
                  course.syllabusDoc = FileLinks[0];

               break;
            }
            end = text.indexOf("<\/h3>", start);
            current = text.slice(start, end);
            current = current.concat("<\/h3>");
            miniDoc = parser.parseFromString(current, "text/xml");
            if (miniDoc.getElementsByTagName("span").length > 1)
               Name = miniDoc.getElementsByTagName("span")[1].textContent;
            check = text.indexOf("<h3>", end);
            attempt = text.indexOf("<div class=\"details", end);
            if (attempt < check)
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
               var DocCollection = new Array();
               for (var j = 0; j < FileLinks.length; j++)
               {
                  var Doc = new Document();
                  Doc.name = FileLinks[j].innerText;
                  Doc.link = FileLinks[j].getAttribute("href");
                  DocCollection[j] = Doc;
               }
               if (miniDoc.getElementsByTagName("div").length > 1)
                  Memo = miniDoc.getElementsByTagName("div")[1].textContent;
            }

            if (type == "Assignments")
            {
               var a = new Assignment();
               a.name = Name;
               a.fileLinks = DocCollection;
               a.memo = Memo;
               assignments[i] = a;
               console.log("Made an assignment named " + Name + " for " + course.title);
            }

            if (type == "Course Materials")
            {
               var m = new Material();
               m.name = Name;
               m.fileLink = FileLinks[0];
               m.memo = Memo;
               materials[i] = m;
            }
            loc = end;
         }

         //NameTemp = text.match(/<h3>[.|\s]*<span[^<]*<img[^<]*<\/span>[.|\s]*(<a href[^>]*>)?<span[^>]*>[^<]*/g);
         // if (NameTemp != null) {
         //    for (i = 0; i < NameTemp.length; i++)
         //    {
         //       txt = NameTemp[i];
         //       texttemp = txt.match(/>[^<]*$/g)[0];
         //       if (texttemp == null)
         //       {
         //          console.log("Error, Masha's regular expression not matched");
         //          break;
         //       }
         //       else {
         //          NameFinal[i] = texttemp.slice(1);
         //       }
         //    }
         // }

         // Mine the links
         // LinkTemp = text.match(/((<div class="details"[\s]*>[.|\s]*<table [^>]*>[.|\s]*(<tbody>[.|\s]*)?(<tr>[.|\s]*)?<th[^<]*<\/th>[.|\s]*(<td>[.|\s]*)?<ul[^<]*(<li>[.|\s]*)?<a href[^<]*<img[^<]*>[^<]*<\/a>)|(<h3>[.|\s]*<span[^<]*<img[^<]*<\/span>[.|\s]*<a href[^>]*><span[^>]*>[^<]*))/g);
         // if (LinkTemp != null) {
         //    for (i = 0; i < LinkTemp.length; i++)
         //     {
         //       txt = LinkTemp[i];
         //       texttemp = txt.match(/((<a href[^<]*<img[^>]*>[^<]*<\/a>)|(<a href[^<]*>))/g)[0];
         //       if (texttemp == null)
         //       {
         //          console.log("Error, Masha's regular expression not matched");
         //          break;
         //       }
         //       else {
         //          LinkFinal[i] = texttemp;
         //       }
         //    }
         // }

         // Mine the memos
         // textrm = text.replace(/<span[^>]*>/g,"");
         // textrm = textrm.replace(/<\/span>/g, "");
         // textrm = textrm.replace(/<p class[^>]*>[\s]*(<b>)?[\s]*(<o:p>)?[\s]*(&nbsp;)?[\s]*(<\/o:p>)?[\s]*(<\/b>)?[\s]*/g, "");
         // textrm = textrm.replace(/<\/p>/g, "<br>");
         // textrm = textrm.replace(/<!--[^>]*>/g, "");
         // textrm = textrm.replace(/<i>/g, "");
         // textrm = textrm.replace(/<\/i>/g, "");
         // textrm = textrm.replace(/<b>/g, "");
         // textrm = textrm.replace(/<\/b>/g, "");
         // textrm = textrm.replace(/<sup>/g, "");
         // textrm = textrm.replace(/<\/sup>/g, "");

         // MemoTemp = textrm.match(/(<div class="details"[\s]*>)?<div class="vtbegenerated">([^<]*(<br>[\s]*)*)*</g);
         // if (MemoTemp != null) {
         //    for (i = 0; i < MemoTemp.length; i++)
         //    {
         //       txt = MemoTemp[i];
         //       texttemp = txt;
         //       texttemp = texttemp.replace(/(<div class="details"[\s]*>)?<div class="vtbegenerated">/g, "");
         //       if (texttemp == null)
         //       {
         //          console.log("Error, Masha's regular expression not matched");
         //          break;
         //       }
         //       else {
         //          MemoFinal[i] = texttemp.replace(/<$/,"");
         //       }
         //    }
         // }

         // Store the assignments
         // if (type == "Assignments")
         // {
         //    if (NameTemp != null)
         //    {
         //       assignments = new Array();
         //       for (i = 0; i < NameFinal.length; i++)
         //       {
         //          var a = new Assignment();
         //          a.name = NameFinal[i];
         //          a.fileLink = LinkFinal[i];
         //          a.memo = MemoFinal[i];
         //          assignments[i] = a;
         //       }
         //       course.assignments = assignments;
         //    }
         // }

         // Store the course materials
         //    if (type == "Course Materials")
         //          {
         //    if (NameTemp != null)
         //    {
         //       materials = new Array();
         //       for (i = 0; i < NameFinal.length; i++)
         //       {
         //          var m = new Material();
         //          m.name = NameFinal[i];
         //          m.fileLink = LinkFinal[i];
         //          m.memo = MemoFinal[i];
         //          materials[i] = m;
         //       }
         //       course.courseMaterials = materials;
         //    }
         // }

         // Store the syllabus
         // if (type == "Syllabus")
         // {
         //    course.syllabusDoc = LinkFinal[0];
         // }
      }
   }
   req.send();
}
