function mineMasha(link, course) {
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
         MemoTemp = text.match(/<div class="details" >[.|\s]*<div class="vtbegenerated">[^<]*/g);
         if (MemoTemp != null) {
            for (i = 0; i < MemoTemp.length; i++)
            {
               txt = MemoTemp[i];
               texttemp = txt.match(/>[^<]*$/g)[0];    
               if (texttemp == null)
               {
                  console.log("Error, Masha's regular expression not matched");
                  break;
               }
               else {
                  MemoFinal[i] = texttemp.slice(1);
               }
            }
         }

         // Store the assignments
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
   }
   req.send();
}
