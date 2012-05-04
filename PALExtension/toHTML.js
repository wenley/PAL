//  Author: Masha Okounkova
//  Written: 14 April 2012
//  toHTML.js

//  Transforms Structures into HTML elements

function toHTML(obj) {
   c = getClass(obj);

   switch (c) {
      case "[object Assignment]":
         return AssignmentToHTML(obj);
      case "[object Document]":
         return DocumentToHTML(obj);
      case "[object Instructor]":
         return InstructorToHTML(obj);
      case "[object Folder]":
         return FolderToHTML(obj);
      case "[object Announcement]":
         return AnnouncementToHTML(obj);
      case "[object Material]":
         return MaterialToHTML(obj);
      case "[object Tool]":
         return ToolToHTML(obj);
      default:
         console.warn("Unrecognized type: " + c);
         break;
   }
   return null;
}

function AssignmentToHTML(asgn) {
   if (getClass(asgn) != "[object Assignment]")
      throw "Improper usage: AssignmentToHTML with " + getClass(asgn);

   cleanObj(asgn);

   var el = document.createElement("div");
   el.setAttribute("class", "documentDiv");
   //  used Assignment objects to store links
   //  Apologies for making code messy
   if (asgn.isLink == "isLink") {
      var a = document.createElement("a");
      a.setAttribute("class", "documentLink");
      a.innerText = asgn.name;
      a.setAttribute("href", asgn.submissionLink);
      el.appendChild(a);
      return el;
   }

   if (asgn.name != null)
   {
      var iName = document.createElement("h3");
      iName.setAttribute("class", "documentName");
      iName.innerText = asgn.name;
      el.appendChild(iName);
   }

   if (asgn.submissionLink != null)
   {
      var iSubLink = document.createElement("a");
      iSubLink.setAttribute("class", "documentSubmissionLink");
      iSubLink.addEventListener("click", function() { populateIframeBack(asgn.submissionLink); }, false);
      iSubLink.innerText = "Submission Link";
      el.appendChild(iSubLink);
   }

   if (asgn.contents != null)
   {
      for (i = 0; i < asgn.contents.length; i++)
      {
         var iFileLink = document.createElement("a");
         iFileLink.setAttribute("class", "documentFileLink");
         iFileLink.setAttribute("href", asgn.contents[i].link);
         iFileLink.innerText = asgn.contents[i].name;
         var br = document.createElement("br");
         el.appendChild(br);
         el.appendChild(iFileLink);
      }
   }

   if (asgn.memo != null)
   {
      var iMemo = document.createElement("p");
      iMemo.setAttribute("class", "documentMemo");
      iMemo.innerText = asgn.memo;
      el.appendChild(iMemo);
   }

   return el;
}

function InstructorToHTML(ins) {
   if (getClass(ins) != "[object Instructor]")
      throw "Improper usage: InstructorToHTML with " + getClass(ins);

   cleanObj(ins);

   var el = document.createElement("div");
   el.setAttribute("class", "documentDiv");

   if (ins.name != null)
   {
      var iName = document.createElement("h3");
      iName.setAttribute("class", "documentName");
      iName.innerText = "Instructor Name: " + ins.name;
      el.appendChild(iName);
   }

   if (ins.email != null)
   {
      var iEmail = document.createElement("p");
      iEmail.setAttribute("class", "documentMemo");
      iEmail.innerText = "Instructor Email: " + ins.email;
      el.appendChild(iEmail);
   }

   if (ins.office != null)
   {
      var iOffice = document.createElement("p");
      iOffice.setAttribute("class", "documentMemo");
      iOffice.innerText = "Instructor Office: " + ins.office;
      el.appendChild(iOffice);
   }

   if (ins.hours != null)
   {
      var iHours = document.createElement("p");
      iHours.setAttribute("class", "documentMemo");
      iHours.innerText = "Instructor Office Hours: " + ins.hours;
      el.appendChild(iHours);
   }

   if (ins.phone != null)
   {
      var iPhone = document.createElement("p");
      iPhone.setAttribute("class", "documentMemo");
      iPhone.innerText = "Instructor Phone: " + ins.phone;
      el.appendChild(iPhone);
   }

   if (ins.notes != null)
   {
      var iNotes = document.createElement("p");
      iNotes.setAttribute("class", "documentMemo");
      iNotes.innerText = ins.notes;
      el.appendChild(iNotes);
   }

   return el;
}

function FolderToHTML(fol) {
   if (getClass(fol) != "[object Folder]")
      throw "Improper usage: FolderToHTML with " + getClass(fol);

   cleanObj(fol);

   var el = document.createElement("div");
   el.setAttribute("class", "documentDiv");

   if (fol.name == null)
      fol.name = "Unnamed Folder";

   var iName = document.createElement("h3");
   iName.setAttribute("class", "documentName");
   if (fol.link != null) {
      var iLink = document.createElement("a");
      iLink.setAttribute("class", "documentLink");
      iLink.addEventListener("click", function() { populateFromFolder(this.innerText) }, false);
      iLink.innerText = fol.name;
      iName.appendChild(iLink);
   }
   else
      iName.innerText = fol.name;
   el.appendChild(iName);

   return el;
}

function AnnouncementToHTML(anc) {
   if (getClass(anc) != "[object Announcement]")
      throw "Improper usage: AnnouncementToHTML with " + getClass(anc);

   cleanObj(anc);

   var el = document.createElement("div");
   el.setAttribute("class", "documentDiv");

   if (anc.heading != null)
   {
      var iHeading = document.createElement("h3");
      iHeading.setAttribute("class", "documentName");
      iHeading.innerText = anc.heading;
      el.appendChild(iHeading);
   }

   if (anc.postedBy != null || anc.date != null)
   {
      var postInfo = document.createElement("h5");
      postInfo.setAttribute("class", "documentMiniName");
      postInfo.innerHTML = "";
      if (anc.postedBy != null)
         postInfo.innerHTML += anc.postedBy;
      if (anc.date != null) {
         if (postInfo.innerText.length > 0)
            postInfo.innerHTML += "<br/>";
         postInfo.innerHTML += anc.date;
      }
      el.appendChild(postInfo);
   }

/* Not supported anymore
   if (anc.postedTo != null)
   {
      var iPostedTo = document.createElement("p");
      iPostedto.innerText = anc.postedTo;
      el.appendChild(iPostedTo);
      } */

/*  Combined with postedBy
   if (anc.date != null)
   {
      var iDate = document.createElement("p");
      iDate.innerText = anc.date;
      el.appendChild(iDate);
      } */

   if (anc.message != null)
   {
      var iMessage = document.createElement("p");
      iMessage.setAttribute("class", "documentMemo");
      iMessage.innerText = anc.message;
      el.appendChild(iMessage);
   }

   return el;
}

function MaterialToHTML(mat) {
   if (getClass(mat) != "[object Material]")
      throw "Improper usage: MaterialToHTML with " + getClass(mat);

   cleanObj(mat);

   var el = document.createElement("div");
   el.setAttribute("class", "documentDiv");

   if (mat.name != null)
   {
      var iName = document.createElement("h3");
      iName.setAttribute("class", "documentName");
      iName.innerText = mat.name;
      el.appendChild(iName);
   }

   if (mat.contents != null)
   {
      for (i = 0; i < mat.contents.length; i++)
      {
         var iFileLink = document.createElement("a");
         iFileLink.setAttribute("class", "documentLink");
         iFileLink.setAttribute("href", mat.contents[i].link);
         if (mat.contents[i].name != undefined)
            iFileLink.innerText = mat.contents[i].name;
         else
            iFileLink.innerText = "Material Link";
         el.appendChild(iFileLink);
      }
   }

   if (mat.memo != null)
   {
      var iMemo = document.createElement("p");
      iMemo.setAttribute("class", "documentMemo");
      iMemo.innerText = mat.memo;
      el.appendChild(iMemo);
   }

   return el;
}

function ToolToHTML(tool) {
   if (getClass(tool) != "[object Tool]")
      throw "Improper usage: ToolToHTML with " + getClass(tool);

   cleanObj(tool);

   var el = document.createElement("div");
   el.setAttribute("class", "documentDiv");
   var iName = document.createElement("h3");
   iName.setAttribute("class", "documentName");
   if (tool.link != null)
   {
      var iLink = document.createElement("a");
      iLink.setAttribute("class", "documentLink");
//      iLink.setAttribute("href", tool.link);
      iLink.setAttribute("link", tool.link);
      iLink.innerText = tool.name;
      iLink.addEventListener("click", function() { populateBodyFromLink(this.getAttribute("link")); }, false);
      iName.appendChild(iLink);
   }
   else {
      iName.innerText = tool.name;
   }
   el.appendChild(iName);
   return el;
}

function DocumentToHTML(doc) {
   if (getClass(doc) != "[object Document]")
      throw "Improper usage: DocumentToHTML with " + getClass(doc);

   cleanObj(doc);

   var el = document.createElement("div");
   el.setAttribute("class", "documentDiv");

   if (doc.name != null)
   {
      var iName = document.createElement("h3");
      iName.setAttribute("class", "documentName");
      iName.innerText = doc.name;
      el.appendChild(iName);
   }

   if (doc.link != null)
   {
      var iLink = document.createElement("a");
      iLink.setAttribute("class", "documentLink");
      iLink.setAttribute("href", doc.link);
      iLink.innerText = doc.name;
      el.appendChild(iLink);
   }
   return el;
}
