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

   if (asgn.name != null)
   {
      var iName = document.createElement("h3");
      iName.innerText = asgn.name;
      el.appendChild(iName);
   }

   if (asgn.submissionLink != null)
   {
      var iSubLink = document.createElement("a");
      iSubLink.setAttribute("href", asgn.submissionLink);
      iSubLink.innerText = "Submission Link";
      el.appendChild(iSubLink);
   }

   if (asgn.fileLinks != null)
   {
      for (i = 0; i < asgn.fileLinks.length; i++)
      {
         var iFileLink = document.createElement("a");
         iFileLink.setAttribute("href", asgn.fileLinks[i].link);
         iFileLink.innerText = asgn.fileLinks[i].name;
         el.appendChild(iFileLink);
      }
   }

   if (asgn.memo != null)
   {
      var iMemo = document.createElement("h3");
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
      var iEmail = document.createElement("h3");
      iEmail.innerText = ins.email;
      el.appendChild(iEmail);
   }

   if (ins.office != null)
   {
      var iOffice = document.createElement("h3");
      iOffice.innerText = ins.office;
      el.appendChild(iOffice);
   }

   if (ins.hours != null)
   {
      var iHours = document.createElement("h3");
      iHours.innerText = ins.hours;
      el.appendChild(iHours);
   }

   if (ins.phone != null)
   {
      var iPhone = document.createElement("h3");
      iPhone.innerText = ins.phone;
      el.appendChild(iPhone);
   }

   if (ins.notes != null)
   {
      var iNotes = document.createElement("h3");
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

   if (fol.name != null)
   {
      var iName = document.createElement("h3");
      iName.innerText = fol.name;
      el.appendChild(iName);
   }

   if (fol.link != null);
   {
      var iLink = document.createElement("a");
//      iLink.setAttribute("href", fol.link);         
//      iLink.addEventListener("click", populateFromFolder(this)
      iLink.innerText = fol.name;
      el.appendChild(iLink);
   }

   return el;
}

function AnnouncementToHTML(anc) {
   if (getClass(anc) != "[object Announcement]")
      throw "Improper usage: AnnouncementToHTML with " + getClass(anc);

   cleanObj(anc);

   var el = document.createElement("div");

   if (anc.postedBy != null)
   {
      var iPostedBy = document.createElement("h3");
      iPostedBy.innerText = anc.postedBy;
      el.appendChild(iPostedBy);
   }

   if (anc.postedTo != null)
   {
      var iPostedTo = document.createElement("h3");
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
      var iDate = document.createElement("h3");
      iDate.innerText = anc.date;
      el.appendChild(iDate);
   }

   if (anc.message != null)
   {
      var iMessage = document.createElement("h3");
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

   if (mat.fileLinks != null)
   {
      for (i = 0; i < mat.fileLinks.length; i++)
      {
         var iFileLink = document.createElement("a");
         iFileLink.setAttribute("href", mat.fileLinks[i].link);
         if (mat.fileLinks[i].name != undefined)
            iFileLink.innerText = mat.fileLinks[i].name;
         else
            iFileLink.innerText = "Material Link";
         el.appendChild(iFileLink);
      }
   }

   if (mat.memo != null)
   {
      var iMemo = document.createElement("h3");
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
