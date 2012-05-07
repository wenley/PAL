//  Author: Wenley Tong
//  Written: 7 May 2012
//  mineOther.js
//  Generalizes mining procedures to tabs with unknown names

//  Handles unknown tab names
function mineOther(link, course, name) {
   var req = new XMLHttpRequest();
   req.open("GET", link, true);
   req.onreadystatechange = function () {
      if (req.readyState == 4 && req.status == 200) {
         XMLdecrement();
         var titleImgId = req.responseText.indexOf("titleicon");
         var imgStart = req.responseText.lastIndexOf("<img", titleImgId);
         var imgEnd = req.responseText.indexOf(">", imgStart);
         
         var imgTag = req.responseText.slice(imgStart, imgEnd + 1);
         var miniDoc = parser.parseFromString(imgTag + "</img>", "text/xml");
         var imgEl = miniDoc.getElementsByTagName("img")[0];
         
         if (imgEl == undefined || imgEl.getAttribute("src") == null)
            return;
         
         var src = imgEl.getAttribute("src");
         var file = src.match(/\/[^\/]*$/)[0];
         file = file.substr(1);
         file = file.match(/^[^_]*/)[0];
         console.log(course.key + ": " + name + ": " + file);

         if (file == "folder")
            mineDocuments(link, course, "other", name);
         else if (file == "blackboard")
            mineTools(link, course, "other", name);
      }
      else if (req.readyState == 4) {
         XMLdecrement();
         console.warn(name + " for " + course.key + " failed.");

/*       //  To replace instance in mineCourse
         var t = new Tool();
         t.name = name;
         t.link = link;
         course.otherLinks.push(t); */
      }
   }

   req.send();
   XMLincrement();
}