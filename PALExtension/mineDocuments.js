function mineDocuments(link, course, type) {
   //console.log("The mine masha link is \n" + link);
   console.log("The mine masha course is \n" + course.title);

   var req = new XMLHttpRequest();
   req.open("GET", link, true);

   req.onreadystatechange = function () {
      if (req.readyState == 4 && req.status == 200) {

         var NameTemp  = new Array();
         var NameFinal = new Array();
         var LinkTemp  = new Array();
         var LinkFinal = new Array();
         var MemoTemp  = new Array();
         var MemoFinal = new Array();

         var textrm;
         var text;
         var txt;
         var texttemp;

         text = req.responseText;

         // Mine the names
         NameTemp = text.match(/<h3>[.|\s]*<span[^<]*<img[^<]*<\/span>[.|\s]*(<a href[^>]*>)?<span[^>]*>[^<]*/g);
         if (NameTemp != null) {
            for (i = 0; i < NameTemp.length; i++)
            {
               txt = NameTemp[i];
               texttemp = txt.match(/>[^<]*$/g)[0];
               if (texttemp == null)
               {
                  console.log("Error, Masha's regular expression not matched");
                  break;
               }
               else {
                  NameFinal[i] = texttemp.slice(1);
               }
            }
         }

         // Mine the links
         LinkTemp = text.match(/((<div class="details"[\s]*>[.|\s]*<table [^>]*>[.|\s]*(<tbody>[.|\s]*)?(<tr>[.|\s]*)?<th[^<]*<\/th>[.|\s]*(<td>[.|\s]*)?<ul[^<]*(<li>[.|\s]*)?<a href[^<]*<img[^<]*>[^<]*<\/a>)|(<h3>[.|\s]*<span[^<]*<img[^<]*<\/span>[.|\s]*<a href[^>]*><span[^>]*>[^<]*))/g);
         if (LinkTemp != null) {
            for (i = 0; i < LinkTemp.length; i++)
            {
               txt = LinkTemp[i];
               texttemp = txt.match(/((<a href[^<]*<img[^>]*>[^<]*<\/a>)|(<a href[^<]*>))/g)[0];
               if (texttemp == null)
               {
                  console.log("Error, Masha's regular expression not matched");
                  break;
               }
               else {
                  LinkFinal[i] = texttemp;
               }
            }
         }

         // Mine the memos
         textrm = text.replace(/<span[^>]*>/g,"");
         textrm = textrm.replace(/<\/span>/g, "");
         textrm = textrm.replace(/<p class[^>]*>[\s]*(<b>)?[\s]*(<o:p>)?[\s]*(&nbsp;)?[\s]*(<\/o:p>)?[\s]*(<\/b>)?[\s]*/g, "");
         textrm = textrm.replace(/<\/p>/g, "<br>");
         textrm = textrm.replace(/<!--[^>]*>/g, "");
         textrm = textrm.replace(/<i>/g, "");
         textrm = textrm.replace(/<\/i>/g, "");
         textrm = textrm.replace(/<b>/g, "");
         textrm = textrm.replace(/<\/b>/g, "");
         textrm = textrm.replace(/<sup>/g, "");
         textrm = textrm.replace(/<\/sup>/g, "");

         MemoTemp = textrm.match(/(<div class="details"[\s]*>)?<div class="vtbegenerated">([^<]*(<br>[\s]*)*)*</g);
         if (MemoTemp != null) {
            for (i = 0; i < MemoTemp.length; i++)
            {
               txt = MemoTemp[i];
               texttemp = txt;
               texttemp = texttemp.replace(/(<div class="details"[\s]*>)?<div class="vtbegenerated">/g, "");
               if (texttemp == null)
               {
                  console.log("Error, Masha's regular expression not matched");
                  break;
               }
               else {
                  MemoFinal[i] = texttemp.replace(/<$/,"");
               }
            }
         }

         // Store the assignments
         if (type == "Assignments")
         {
            if (NameTemp != null)
            {
               assignments = new Array();
               for (i = 0; i < NameFinal.length; i++)
               {
                  var a = new Assignment();
                  a.name = NameFinal[i];
                  a.fileLink = LinkFinal[i];
                  a.memo = MemoFinal[i];
                  assignments[i] = a;
               }
               course.assignments = assignments;
            }
         }
         
         // Store the course materials
         if (type == "Course Materials")
         {
            if (NameTemp != null)
            {
               materials = new Array();
               for (i = 0; i < NameFinal.length; i++)
               {
                  var m = new Material();
                  m.name = NameFinal[i];
                  m.fileLink = LinkFinal[i];
                  m.memo = MemoFinal[i];
                  materials[i] = m;
               }
               course.courseMaterials = materials;
            }
         }

         // Store the syllabus
         if (type == "Syllabus")
         {
            course.syllabusDoc = LinkFinal[0]; 
         }
      }
   }
   req.send();
}
