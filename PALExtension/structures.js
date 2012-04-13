//  An instructor from the Contacts of a Course
function Instructor() {
   this.name = "";
   this.email = "";
   this.office = "";
   this.hours = "";
   this.notes = "";
}

//  A folder in a sidebar elements
function Folder() {
   this.name = "";
   this.link = "";
}


//  Document for Assignmets
function Document() {
   this.name = "";
   this.link = "";
}

//  Container for information on an assignment
function Assignment() {
   this.name = "";
   this.submissionLink = "";
   this.fileLinks = new Array();
   // Some assignments consist of text directly on the Assignments link
   this.memo = "";
}

//  Huge container for information on a particular Course
function Course() {
   this.title = null;
   this.sidebarElements = null;
   this.announcements = null;
   this.syllabusDoc = null;
   this.descriptionLink = null;
   this.courseMaterials = null;
   this.assignments = new Array();
   this.contacts = new Array();
   this.tools = new Array();
   this.otherLinks = new Array();
}

//  An Announcement of a Course on Blackboard
function Announcements() {
    this.postedBy = "";
    this.postedTo = "";
    this.heading = "";
    this.date = "";
    this.message = "";
}

// A Course Material
function Material() {
   this.name = "";
   this.fileLinks = "";
   this.memo = "";
}

//  A Tool from the Tools section of a Course
function Tool() {
   this.name = "";
   this.link = "";
}