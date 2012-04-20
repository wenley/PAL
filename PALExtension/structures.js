//  An instructor from the Contacts of a Course
function Instructor() {
   this.name = "";
   this.email = "";
   this.office = "";
   this.hours = "";
   this.phone = "";
   this.notes = "";
   this.type = this.constructor.name;

   this.toHTML = function () {
      //  Make unused entries null
      cleanObj(arguments.callee.caller);

      console.log(email);
      console.log(office);
      console.log(hours);
      console.log(phone);
      console.log(notes);

      var el = document.createElement("div");

      if (name != "")
      {
         var iName = document.createElement("h3");
         iName.innerText = name;
         el.appendChild(iName);
      }

      if (email != "")
      {
         var iEmail = document.createElement("h3");
         iEmail.innerText = email;
         el.appendChild(iEmail);
      }

      if (office != "")
      {
         var iOffice = document.createElement("h3");
         iOffice.innerText = office;
         el.appendChild(iOffice);
      }

      if (hours != "")
      {
         var iHours = document.createElement("h3");
         iHours.innerText = hours;
         el.appendChild(iHours);
      }

      if (phone != "")
      {
         var iPhone = document.createElement("h3");
         iPhone.innerText = phone;
         el.appendChild(iPhone);
      }

      if (notes != "")
      {
         var iNotes = document.createElement("h3");
         iNotes.innerText = notes;
         el.appendChild(iNotes);
      }

      return el;
   }
}

//  A folder in a sidebar elements
function Folder() {
   this.name = "";
   this.link = "";
   this.type = this.constructor.name;

   this.toHTML = function () {
      // Make unused entries null
      cleanObj(arguments.callee.caller);

      console.log(name);
      console.log(link);

      var el = document.createElement("div");

      if (name != "")
      {
         var iName = document.createElement("h3");
         iName.innerText = name;
         el.appendChild(iName);
      }

      if (link != "");
      {
         var iLink = document.createElement("a");
         iLink.setAttribute("href", link);
         iLink.innerText = "Link";
         el.appendChild(iLink);
      }

      return el;
   }
}

//  Document for Assignmets
function Document() {
   this.name = "";
   this.link = "";
   this.type = this.constructor.name;

   this.toHTML = function () {
      // Make unused entries null
      cleanObj(arguments.callee.caller);

      console.log(name);
      console.log(link);

      var el = document.createElement("div");

      if (name != "")
      {
         var iName = document.createElement("h3");
         iName.innerText = name;
         el.appendChild(iName);
      }

      if (link != "")
      {
         var iLink = document.createElement("a");
         iLink.setAttribute("href", link);
         iLink.innerText = "Link";
         el.appendChild(iLink);
      }

      return el;
   }

}

//  Container for information on an assignment
function Assignment() {
   this.name = "";
   this.submissionLink = "";
   this.fileLinks = new Array();
   // Some assignments consist of text directly on the Assignments link
   this.memo = "";
   this.type = this.constructor.name;

   this.toHTML = function () {
      // Make unused entries null
      cleanObj(arguments.callee.caller);

      console.log(name);
      console.log(submissionLink);
      console.log(fileLinks);
      console.log(memo);

      var el = document.createElement("div");

      if (name != "")
      {
         var iName = document.createElement("h3");
         iName.innerText = name;
         el.appendChild(iName);
      }

      if (submissionLink != "")
      {
         var iSubLink = document.createElement("a");
         iSubLink.setAttribute("href", submissionLink);
         iSubLink.innerText = "Submission Link";
         el.appendChild(iSubLink);
      }

      if (fileLinks != undefined && fileLinks.length != 0)
      {
         for (i = 0; i < fileLinks.length; i++)
         {
            var iFileLink = document.createElement("a");
            iFileLink.setAttribute("href", fileLinks[i]);
            iFileLink.innerText = "Assignment Link";
            el.appendChile(iFileLink);
         }
      }

      if (memo != "")
      {
         var iMemo = document.createElement("h3");
         iMemo.innerText = memo;
         el.appendChild(iMemo);
      }

      return el;
   }
}

//  Huge container for information on a particular Course
function Course() {
   //  Name of the course
   this.title = null;

   //  Key under which this course can be found in Courses
   this.key = null;

   //  Link to content page of this Course
   this.contentLink = null;

   //  Array of announcements of this course
   this.announcements = null;

   //  Syllabus Document Object
   this.syllabusDoc = null;

   //  Link to registrar's page for the course
   this.descriptionLink = null;

   //  Array of documents and folders of Course Materials
   this.courseMaterials = null;

   //  Array of documents and folders of Assignments
   this.assignments = new Array();

   //  Array of instructors and folders of Assignments
   this.contacts = new Array();

   //  Array of Tool Objects
   this.tools = new Array();

   //  Array of other sidebar element links
   this.otherLinks = new Array();

   this.type = this.constructor.name;

}

//  An Announcement of a Course on Blackboard
function Announcement() {
   this.postedBy = "";
   this.postedTo = "";
   this.heading = "";
   this.date = "";
   this.message = "";
   this.type = this.constructor.name;

   this.toHTML = function () {
      cleanObj(arguments.callee.caller);

      console.log(postedBy);
      console.log(postedTo);
      console.log(heading);
      console.log(date);
      console.log(message);

      var el = document.createElement("div");

      if (postedBy != "")
      {
         var iPostedBy = document.createElement("h3");
         iPostedBy.innerText = postedBy;
         el.appendChild(iPostedBy);
      }

      if (postedTo != "")
      {
         var iPostedTo = document.createElement("h3");
         iPostedto.innerText = postedTo;
         el.appendChild(iPostedTo);
      }

      if (heading != "")
      {
         var iHeading = document.createElement("h3");
         iHeading.innerText = heading;
         el.appendChild(iHeading);
      }

      if (date != "")
      {
         var iDate = document.createElement("h3");
         iDate.innerText = date;
         el.appendChild(iDate);
      }

      if (message != "")
      {
         var iMessage = document.createElement("h3");
         iMessage.innerText = message;
         el.appendChild(iMessage);
      }

      return el;
   }
}

// A Course Material
function Material() {
   this.name = "";
   this.fileLinks = "";
   this.memo = "";
   this.type = this.constructor.name;

   this.toHTML = function () {
      // Make unused entries null
      cleanObj(arguments.callee.caller);

      console.log(name);
      console.log(fileLinks);
      console.log(memo);

      var el = document.createElement("div");

      if (name != "")
      {
         var iName = document.createElement("h3");
         iName.innerText = name;
         el.appendChild(iName);
      }

      if (fileLinks != "")
      {
         var iFileLink = document.createElement("a");
         iFileLink.setAttribute("href", fileLinks);
         iFileLink.innerText = "Assignment Link";
         el.appendChile(iFileLink);
      }

      if (memo != "")
      {
         var iMemo = document.createElement("h3");
         iMemo.innerText = memo;
         el.appendChild(iMemo);
      }

      return el;
   }


}

//  A Tool from the Tools section of a Course
function Tool() {
   this.name = "";
   this.link = "";
   this.type = this.constructor.name;

   this.toHTML = function () {
      // Make unused entries null
      cleanObj(arguments.callee.caller);

      console.log(name);
      console.log(link);

      var el = document.createElement("div");

      if (name != "")
      {
         var iName = document.createElement("h3");
         iName.innerText = name;
         el.appendChild(iName);
      }

      if (link != "")
      {
         var iLink = document.createElement("a");
         iLink.setAttribute("href", link);
         iLink.innerText = "Link";
         el.appendChild(iLink);
      }

      return el;
   }

}