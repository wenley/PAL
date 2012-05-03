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

   //  used Assignment objects to store links
   //  Apologies for making code messy
   if (asgn.isLink == "isLink") {
      var a = document.createElement("a");
      a.innerText = asgn.name;
      a.setAttribute("href", asgn.submissionLink);
      el.appendChild(a);
      return el;
   }

   if (asgn.name != null)
   {
      var iName = document.createElement("h3");
      iName.innerText = asgn.name;
      el.appendChild(iName);
   }

   if (asgn.submissionLink != null)
   {
      var iSubLink = document.createElement("a");
      iSubLink.addEventListener("click", function() { populateIframeBack(asgn.submissionLink); }, false);
      iSubLink.innerText = "Submission Link";
      el.appendChild(iSubLink);
   }

   if (asgn.contents != null)
   {
      for (i = 0; i < asgn.contents.length; i++)
      {
         var iFileLink = document.createElement("a");
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

   if (ins.name != null)
   {
      var iName = document.createElement("h3");
      iName.innerText = ins.name;
      el.appendChild(iName);
   }

   if (ins.email != null)
   {
      var iEmail = document.createElement("p");
      iEmail.innerText = ins.email;
      el.appendChild(iEmail);
   }

   if (ins.office != null)
   {
      var iOffice = document.createElement("p");
      iOffice.innerText = ins.office;
      el.appendChild(iOffice);
   }

   if (ins.hours != null)
   {
      var iHours = document.createElement("p");
      iHours.innerText = ins.hours;
      el.appendChild(iHours);
   }

   if (ins.phone != null)
   {
      var iPhone = document.createElement("p");
      iPhone.innerText = ins.phone;
      el.appendChild(iPhone);
   }

   if (ins.notes != null)
   {
      var iNotes = document.createElement("p");
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

   if (fol.name == null)
      fol.name = "Unnamed Folder";

   var iName = document.createElement("p");
   if (fol.link != null) {
      var iLink = document.createElement("a");
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

   if (anc.postedBy != null)
   {
      var iPostedBy = document.createElement("p");
      iPostedBy.innerText = anc.postedBy;
      el.appendChild(iPostedBy);
   }

   if (anc.postedTo != null)
   {
      var iPostedTo = document.createElement("p");
      iPostedto.innerText = anc.postedTo;
      el.appendChild(iPostedTo);
   }

   if (anc.heading != null)
   {
      var iHeading = document.createElement("h3");
      iHeading.innerText = anc.heading;
      el.appendChild(iHeading);
   }

   if (anc.date != null)
   {
      var iDate = document.createElement("p");
      iDate.innerText = anc.date;
      el.appendChild(iDate);
   }

   if (anc.message != null)
   {
      var iMessage = document.createElement("p");
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

   if (mat.name != null)
   {
      var iName = document.createElement("h3");
      iName.innerText = mat.name;
      el.appendChild(iName);
   }

   if (mat.contents != null)
   {
      for (i = 0; i < mat.contents.length; i++)
      {
         var iFileLink = document.createElement("a");
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
   var iName = document.createElement("h3");
   if (tool.link != null)
   {
      var iLink = document.createElement("a");
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

   if (doc.name != null)
   {
      var iName = document.createElement("h3");
      iName.innerText = doc.name;
      el.appendChild(iName);
   }

   if (doc.link != null)
   {
      var iLink = document.createElement("a");
      iLink.setAttribute("href", doc.link);
      iLink.innerText = doc.name;
      el.appendChild(iLink);
   }
   return el;
}
