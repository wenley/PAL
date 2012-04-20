//  Author: Wenley Tong
//  Written: 8 April 2012

//  Checks to see if field is a desired type
function isInstructorField(s) {
   if (s == "Email")
      return true;
   else if (s == "Office Location")
      return true;
   else if (s == "Office Hours")
      return true;
   else if (s == "Work Phone")
      return true;
   else if (s == "Notes")
      return true;
   else
      return false;
}

function extractContacts(textArea, course) {
   //  Alternate h3 and div class details tags
   var hStart = 0;
   var hEnd = 0;
   var divStart = 0;
   var divEnd = 0;
   var j = 0;

   //  Find all instructors
   do {
      //  Get name of entry
      hStart = textArea.indexOf("<h3>", hEnd);
      if (hStart == -1)
         break;
      hEnd = textArea.indexOf("</h3>", hStart);
      if (hEnd == -1)
         break;
      var instructorP = textArea.slice(hStart, hEnd) + "</h3>";

      var name;
      var bits = instructorP.match(/>[^<]*</g);
      for (var k = 0; k < bits.length; k++) {
         bits[k] = bits[k].slice(1, -1);
         bits[k] = strip(bits[k]);
         if (bits[k] != "") {
            name = bits[k];
         }
      }

      //  Need to detect folder
      var aTag = instructorP.match(/<a[^>]*>[^<]*<\/a>/g);
      if (aTag != null) {
         var miniDoc = parser.parseFromString(cleanLink(aTag[0]), "text/xml");
         var f = new Folder();
         f.name = name;
         f.link = miniDoc.getElementsByTagName("a")[0].getAttribute("href");
         course.contacts[course.contacts.length] = f;
         continue;
      }

      //  Is a true Instructor
      var i = new Instructor();
      i.name = name;

      //  Get details of an Instructor
      divStart = textArea.indexOf("<div class=\"details", hEnd);
      if (divStart == -1) {
         console.warn("continuing...");
         continue;
      }
      divEnd = textArea.indexOf("</div>", divStart);
      if (divEnd == -1)
         throw "No end of div";

      var detailP = textArea.slice(divStart, divEnd) + "</div>";
      var details = detailP.match(/>[^<]*</g);
      var cleanDetails = new Array();
      for (var q = 0; q < details.length; q++) {
         details[q] = details[q].replace(/\n/, "");
         details[q] = details[q].slice(1, -1);
         var s = strip(details[q]);
         if (s != "") {
            cleanDetails[cleanDetails.length] = s;
         }
      }

      console.log(cleanDetails);
      for (var k = 0; k < cleanDetails.length; k++) {
         s = cleanDetails[k];
         next = cleanDetails[k + 1];
         if (next == undefined) {
            next = "";
         }
         if (s == "Email" && !isInstructorField(next)) {
            i.email = next;
            k = k + 1;
         }
         else if (s == "Office Location" && !isInstructorField(next)) {
            i.office = next;
            k = k + 1;
         }
         else if (s ==  "Office Hours" && !isInstructorField(next)) {
            i.hours = next;
            k = k + 1;
         }
         else if (s == "Work Phone" && !isInstructorField(next)) {
            i.phone = next;
            k = k + 1;
         }
         else if (s == "Notes" && !isInstructorField(next)) {
            i.notes = next;
            k = k + 1;
         }
         else
            console.warn(course.key + ": Unknown Instructor detail: " + s);
      }
      course.contacts[course.contacts.length] = i;
      j = j + 1;
   } while (j < 100);    //  !!! Make true

   pushCourse(course);
}


//  Takes course content document's sidebar link for Contacts
//  Gets array of instructor's names and detailed information
function mineContacts(sidebarLink, course) {
   var req = new XMLHttpRequest();
   req.open("GET", sidebarLink, true);
   req.onreadystatechange = function () {
      if (req.readyState == 4 && req.status == 200) {
         var listStart = req.responseText.indexOf("contentList staffInfoList");
         if (listStart == -1) {
            return;
         }

         var listEnd = req.responseText.indexOf("ul>", listStart);
         if (listEnd == -1) {
            console.warn(course.key + ": Couldn't find end");
            return;
         }

         var list = req.responseText.slice(listStart, listEnd);
         extractContacts(list, course);
      }
      else if (req.readyState == 4) {
         console.warn(course.key);
         console.warn("Error in loading page");
         console.warn("Ready state: ");
         console.warn(req.readyState);
         console.warn("HTTP Status");
         console.warn(req.status);
      }
   }
   req.send();
}
